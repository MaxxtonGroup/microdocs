<?php
header('Content-Type: application/json');
$string = file_get_contents("settings.json");
if($string == false){
    http_send_status(500);
    $response = array("status" => "failed", "message" => "Could not load settings.json");
    exit(json_encode($response));
}
$json = json_decode($string, true);
if($json == null){
    http_send_status(500);
    $response = array("status" => "failed", "message" => "settings.json is not valid json");
    exit(json_encode($response));
}

echo $string;
?>
