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
        $path = implode('/',$this->getParams());
        move_uploaded_file($fic['tmp_name'],'files/'.$path.'/'.$fic['name']);

    }

    public function create_dir(){
        var_dump(Input::post('path'));
        var_dump(Input::post('name'));
        //htmlentities(Input::post('name'));
        mkdir('files/'.Input::post('path').'/'.Input::post('name'));
    }

    public function deleteA(){
        $path = $this->getParams();
        $path = implode('/',$path);
        var_dump($this->Delete2('files/'.$path));

    }

    function Delete2($path)
    {
        if (is_dir($path) === true)
        {
            $files = array_diff(scandir($path), array('.', '..'));

            foreach ($files as $file)
            {
                $this->Delete2(realpath($path) . '/' . $file);
            }

            return rmdir($path);
        }

        else if (is_file($path) === true)
        {
            return unlink($path);
        }

        return false;
    }

    public function down(){
        $file = $this->getParams()[sizeof($this->getParams()) - 1];
        $path = implode('/',$this->getParams());
        $path = $_SERVER["DOCUMENT_ROOT"] .'/files/'.$path;

        $file = str_replace(' ','_',$file);

        if (file_exists($path)) {
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename='.$file);
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($path));
            readfile($path);
            exit;
        }
    }
}