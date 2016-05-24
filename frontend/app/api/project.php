<?php
/**
 * Get list of all projectgroups with projects.
 * @author Steven Hermans
 */
try {
    require 'core.php';

    if (!isset($_GET['project']) || empty($_GET['project'])) {
        http_response_code(400);
        exit("missing RequestParam: 'project'");
    }
    $projectName = $_GET['project'];
    $project = getProjectByName($projectName);

    if ($project == null) {
        http_response_code(404);
        exit("project doesn't exist");
    }

    if (!isset($_GET['version']) || empty($_GET['version'])) {
        $version = getLatestVersion($project);
    } else {
        $version = $_GET['version'];
    }

    $projectJson = getAggregatedProject($project, $version, false);
    header('Content-Type: application/json');
    echo $projectJson;
}catch(Exception $e){
    http_response_code(500);
    throw $e;
}
