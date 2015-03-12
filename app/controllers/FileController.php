<?php
/**
 * Created by PhpStorm.
 * User: loic
 * Date: 28/02/15
 * Time: 08:32
 */

namespace app\controllers;

use SFramework\mvc\Controller;
use SFramework\Helpers\Input;
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

    public function upload(){
        $fic=$_FILES['fic'];

        move_uploaded_file($fic['tmp_name'],'files/'.($this->getParams()[0]).'/'.$fic['name']);

        print_r($this->getParams());
    }

    public function create_dir(){
        var_dump(Input::post('path'));
        var_dump(Input::post('name'));
        //htmlentities(Input::post('name'));
        mkdir('files/'.Input::post('path').'/'.Input::post('name'));
    }

    public function delete(){

    }
}