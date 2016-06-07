<?php
/**
 * Get list of all projectgroups with projects.
 * @author Steven Hermans
 */
header('Content-Type: application/json');
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
                    array_push($links, array("source" => strtolower($project['name']), "target" => strtolower($client['name']), "type" => "client"));
                }
            }
            if(isset($project['dependencies'])){
                foreach($project['dependencies'] as $dependency){
                    array_push($links, array("source" => strtolower($project['name']), "target" => strtolower($dependency), "type" => "dependency"));
                }
            }
        }
    }

    $response = array("nodes" => $projects, "links" => $links);

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    $response = array("status" => "failed", "message" => $e->getMessage());
    exit(json_encode($response));
}
