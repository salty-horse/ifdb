#!/usr/bin/env php
<?php
$userid = $argv[1];
$session_save_path = session_save_path();
if ($session_save_path === "") $session_save_path = '/tmp';
$sessionFiles = scandir($session_save_path);
session_start();
$original = $_SESSION;
foreach ($sessionFiles as $sessionFileName) {
    if(strpos($sessionFileName,"sess_") === 0) {
        $_SESSION = $original;
        $sessionName = str_replace("sess_","",$sessionFileName);
        $sessionFile = $session_save_path."/".$sessionFileName;
        $session_contents = file_get_contents($sessionFile);
        session_decode($session_contents);
        if (isset($_SESSION['logged_in_as']) && $_SESSION['logged_in_as'] === $userid) {
            unlink($sessionFile);
            echo "deleted session $sessionFile";
        }
    }
}