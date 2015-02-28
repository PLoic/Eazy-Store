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
    /**
     * @var UserModel the user model duh
     */
    private $userModel;

    public function __construct()
    {
        $this->userModel = $this->loadModel('User');
        parent::__construct();
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
            mkdir(DatabaseProvider::connection()->lastInsertId());
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
        else {
            $this->getView()->redirect('/');
        }
    }

    public function auth()
    {
        try {
            $username = Input::post('username');
            $password = Input::post('password');

            $validAuth = $this->userModel->validateAuthentication($username, $password);
            if (!empty($validAuth)) {

                Authentication::getInstance()->setAuthenticated($username, $validAuth['id']);
                $this->getView()->redirect('/');
            } else {
                // TODO POPUP WRONG CREDENTIALS MESSAGE

                $this->getView()->redirect('/');
            }
        } catch (InputNotSetException $e) {
            //throw $e;
            $this->getView()->redirect('/');
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

}