<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 27/01/15
 * Time: 22:48
 */

namespace app\controllers;

use SFramework\mvc\Controller;
use SFramework\Helpers\Authentication;

class HomeController extends Controller
{

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        if(Authentication::getInstance()->isAuthenticated())
            $this->getView()->render('home/index', ['id'=>Authentication::getInstance()->getUserId()-1]);
        else
            $this->getView()->render('home/index');
    }
}