<?php
/**
 * Get list of all projectgroups with projects.
 * @author Steven Hermans
 */
header('Content-Type: application/json');
try {
    require 'core.php';

    if (!isset($_GET['project']) || empty($_GET['project'])) {
        http_response_code(400);
        $response = array("status" => "failed", "message" => "missing RequestParam: 'project'");
        exit($response);
    }
    $projectName = $_GET['project'];
    $project = getProjectByName($projectName);

    if ($project == null) {
        http_response_code(404);
        $response = array("status" => "failed", "message" => "project doesn't exist");
        exit($response);
    }

    if (!isset($_GET['version']) || empty($_GET['version'])) {
        $version = getLatestVersion($project);
    } else {
        $version = $_GET['version'];
    }

    $projectJson = getAggregatedProject($project, $version, false);
    if($projectJson != null) {
        exit($projectJson);
    }else{
        if(hasAggregatedVersionExists($project, $version)){
            $project['cleaned'] = true;
            exit(json_encode($project));
        }else{
            http_response_code(404);
            $response = array("status" => "failed", "message" => "Project " . $project['name'] . ":" . $version . " doesn't exists");
            exit(json_encode($response));
        }
    }
}catch(Exception $e){
    http_response_code(500);
    $response = array("status" => "failed", "message" => $e->getMessage());
    exit(json_encode($response));
}
