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

    private $path;

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
                Authentication::getInstance()->setAuthenticated($username, $this->validAuth['id']);;
                $this->getView()->render('layout/default',['id'=>Authentication::getInstance()->getUserId()-1]);
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

    public function file_list($path3 = ''){
        $path = $this->getParams();

        //var_dump($path);

        if(sizeof($path) == 1){
            $test = false;
            $id = (int)$path[0];
            $tabtmp = scandir('files/'.$id);
        }
        else{
            $test = true;
            $id = (int)$path[0];
            $path2 = implode('/',$path);
            //var_dump($path2);
            $tabtmp = scandir('files/'.$path2);
        }
        $this->_fileTypes = require_once('app/config/filesTypes.php');

        $tab = array();
        foreach($tabtmp as $key=>$value){
            $file_info = explode('.',$value);
            if(sizeof($file_info)>1 && $file_info[0] != '')
            {
                $tab[$value] =  $this->_fileTypes[$file_info[sizeof($file_info)-1]];

            }elseif(is_dir('files/'.($path3 == '')? $id : $path3 .'/'.$file_info[0])) {

                $tab[$value] = "fa fa-folder fa-fw";

            }
        }

        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        echo json_encode($tab);
        //if(!$test)
        //    $this->getView()->render('file/index', ['file'=>$tab, 'id' => $id]);
        //else
        //    $this->getView()->render('file/folder', ['file'=>$tab, 'id' => $id, 'folder' => $path[sizeof($path)-1]]);
    }

    public function folder(){
        $this->path = Input::get('path');
        $this->file_list($this->path);

    }

    public function folder2(){
        $this->file_list($this->path);
    }

}