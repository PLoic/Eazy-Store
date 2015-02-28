<?php
/**
 * Created by PhpStorm.
 * User: loic
 * Date: 28/02/15
 * Time: 08:32
 */

namespace app\controllers;

use SFramework\mvc\Controller;
use app\models\FileModel;

class FileController extends Controller {

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $this->getView()->render('file/index');
    }
}