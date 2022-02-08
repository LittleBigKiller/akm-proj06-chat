<?php
include("tajne.php");  //require
$dbh = new PDO($host, $user, $passwd);

if (isset($_POST['action']) && $_POST['action'] == 'get') {
    $sth = $dbh->prepare("SELECT * FROM `ajax-long-polling`");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
} elseif (isset($_POST['action']) && $_POST['action'] == 'getMessages') {
    $sth = $dbh->prepare("SELECT * FROM `ajax-long-polling` WHERE `id` > :id");
    $sth->bindParam(':id', $_POST['id'], PDO::PARAM_STR);
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
} elseif (isset($_POST['action']) && $_POST['action'] == 'sendMessage') {
    $sth = $dbh->prepare("INSERT INTO `ajax-long-polling` VALUES('',:nn,:msg,:c,:t)");
    $sth->bindParam(':nn', $_POST['nn'], PDO::PARAM_STR);
    $sth->bindParam(':msg', $_POST['msg'], PDO::PARAM_STR);
    $sth->bindParam(':c', $_POST['c'], PDO::PARAM_STR);
    $sth->bindParam(':t', time(), PDO::PARAM_STR);
    $sth->execute();

    $sth = $dbh->prepare("DELETE FROM `ajax-long-polling` WHERE (id NOT IN (SELECT * FROM (SELECT `id` FROM `ajax-long-polling` ORDER BY `id` DESC LIMIT 256) AS temp))");
    $sth->execute();
} elseif (isset($_POST['action']) && $_POST['action'] == 'getLastId') {
    $sth = $dbh->prepare("SELECT MAX(id) AS id FROM `ajax-long-polling`");
    $sth->execute();
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}
