<?php
/**
 * Created by PhpStorm.
 * User: loic
 * Date: 27/02/15
 * Time: 18:49
 */

namespace app\controllers;

use SFramework\mvc\Controller;
use app\models\UserModel;

use SFramework\Exceptions\InputNotSetException;
use SFramework\Helpers\Authentication;
use SFramework\Helpers\Input;
use SFramework\Database\DatabaseProvider;

class UserController extends Controller
{

    private  $_fileTypes ;

    private  $validAuth;

    /**
     * @var UserModel the user model duh
     */
    private $userModel;

    public function __construct()
    {
        $this->userModel = $this->loadModel('User');
        parent::__construct();
    }

    public function index()
    {
        $this->file_list();
    }

    public function register()
    {
        $this->getView()->render('users/signup');
    }

    public function save_register()
    {
        $user = [
            'username' => Input::post('user'),
            'password' => Input::post('pwd'),
            'mail' => Input::post('mail'),
        ];


        try {
            $this->userModel->insertUser($user);
        mkdir('files/'.(DatabaseProvider::connection()->lastInsertId()+1));
        } catch (\PDOException $e) {
            $match = [];
            if (preg_match('/SQLSTATE\[23000]: Integrity constraint violation: 1062 Duplicate entry \'(?P<value>.*)\' for key \'(?P<field>.*)_UNIQUE\'/', $e->getMessage(), $match)) {
                switch ($match['field']) {
                    case 'username':
                        $errors[] = 'Ce nom d\'utilisateur est déjà pris !';
                        break;
                    default:
                        $errors[] = 'Unknown database error.';
                }
            } else throw $e;

        }

        if (!empty($errors)){
            $this->getView()->render('user/register', ['user' => $user, 'errors' => $errors]);
        }
    }

    public function auth()
    {
        try {

            $username = Input::post('username');
            $password = Input::post('password');

            $this->validAuth = $this->userModel->validateAuthentication($username, $password);

            if (!empty($this->validAuth)) {
                Authentication::getInstance()->setAuthenticated($username, $this->validAuth['id']);
                $this->getView()->render('layout/default',$this->validAuth);
            } else {
                // TODO POPUP WRONG CREDENTIALS MESSAGE
                print_r($this->validAuth);
                //$this->getView()->redirect('/');
            }
        } catch (InputNotSetException $e) {
            //throw $e;
            //$this->getView()->redirect('/');
        }
    }

    public function connect()
    {

        $this->getView()->render('users/signin');
    }

    public function disconnect(){
            Authentication::getInstance()->disconnect();
            $this->getView()->redirect('/');
    }

    public function file_list(){
        //echo '********************************************';
        $id = ((int)$this->getParams()[0]);
        $this->_fileTypes = require_once('app/config/filesTypes.php');
        $tabtmp = scandir('files/'.($id-1));
        $tab = array();
        foreach($tabtmp as $key=>$value){
            $file_info = explode('.',$value);
            if(sizeof($file_info)>1 && $file_info[0] != '')
            {
                $tab[$value] =  $this->_fileTypes[$file_info[sizeof($file_info)-1]];

            }elseif(is_dir('files/'.($id-1).'/'.$file_info[0])) {

                $tab[$value] = "fa fa-folder fa-fw";

            }
        }

        $this->getView()->render('file/index', ['file'=>$tab, 'id' => $id]);
    }

}