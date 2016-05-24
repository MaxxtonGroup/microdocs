<?php
/**
 * Get list of all projectgroups with projects.
 * @author Steven Hermans
 */
try {
    require 'core.php';

    $json = getAggregatedProjects();
    $projectList = $json['projects'];

    $response = array();
    $projects = array();
    $links = array();
    foreach($projectList as $project){
        $projects[$project['name']] = array("name" => $project['name']);
        if($project != null){
            if(isset($project['clients'])){
                foreach($project['clients'] as $client){
                    array_push($links, array("source" => $project['name'], "target" => $client['name'], "type" => "client"));
                }
            }
        }
    }

    $response = array("nodes" => $projects, "links" => $links);

    header('Content-Type: application/json');
    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    throw $e;
}