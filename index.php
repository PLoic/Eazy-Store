<?php

require 'vendor/autoload.php';

use app\models\UserModel;
use SFramework\Database\DatabaseProvider;
use SFramework\Helpers\Authentication;
use SFramework\Helpers\BaseViewContextProvider;

session_start();

define('CR', "\n");
define('TAB', '    ');

define('DS', DIRECTORY_SEPARATOR);
define('FSROOT', __DIR__ . DS);

if (dirname($_SERVER['SCRIPT_NAME']) != '/') {
    define('WEBROOT', dirname($_SERVER['SCRIPT_NAME']) . DS);
} else {
    define('WEBROOT', dirname($_SERVER['SCRIPT_NAME']));
}

define('DEBUG', true);

if (DEBUG) {
    ini_set('display_errors', true);
    ini_set('html_errors', true);
    error_reporting(E_ALL);
}

function main()
{
    DatabaseProvider::connect("app/config/database.json");

    $router = new \SFramework\Routing\Router();


    $router->add('/errors/err404', new \app\controllers\ErrorsController(), 'err404');
    $router->add('/signup', new \app\controllers\UserController(), 'register');
    $router->add('/signin', new \app\controllers\UserController(), 'connect');
    $router->add('/user/auth', new \app\controllers\UserController(), 'auth','POST');
    $router->add('/user/register', new \app\controllers\UserController(), 'save_register','POST');
    $router->add('/user/disconnect', new \app\controllers\UserController(), 'disconnect');
    $router->add('/', new \app\controllers\HomeController(), 'index');


    $router->matchCurrentRequest();
}

if (DEBUG) {
    main();
} else {
    try {
        main();
    } catch (Exception $e) {
        echo 'Internal server error.';
    }
}
