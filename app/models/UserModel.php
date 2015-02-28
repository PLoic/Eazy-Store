<?php
/**
 * Created by PhpStorm.
 * User: loic
 * Date: 27/02/15
 * Time: 19:42
 */

namespace app\models;

use SFramework\Database\DatabaseProvider;
use SFramework\mvc\Model;

class UserModel extends Model
{
    const INSERT_USER = <<<SQL
    INSERT INTO user (username, mail, password)
            VALUES (:username, :mail, SHA1(:password))
SQL;
    const VALIDATE_AUTH = <<<SQL
SELECT id, username
FROM user u
WHERE username = :username
  AND password = SHA1(:password)
SQL;

    public function insertUser(array $infos)
    {
        try {
            DatabaseProvider::connection()->beginTransaction();
            $success = DatabaseProvider::connection()->execute(self::INSERT_USER, $infos);

            DatabaseProvider::connection()->commit();

            return $success;
        } catch (\Exception $e) {
            DatabaseProvider::connection()->rollBack();
            throw $e;
        }
    }

    public function validateAuthentication($username, $password)
    {
        return DatabaseProvider::connection()->selectFirst(self::VALIDATE_AUTH, [
            'username' => $username,
            'password' => $password
        ]);
    }
}