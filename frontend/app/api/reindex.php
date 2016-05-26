<?php
/**
 * (re)index all the project and dependencies
 * @author Steven Hermans
 */
try{
    require 'core.php';

    // only allow http put and daemons
    if(isset($_SERVER['REQUEST_METHOD'])){
        if(strtolower($_SERVER['REQUEST_METHOD']) != 'put'){
            http_response_code(405);
            exit("Only PUT is allowed");
        }
    }

    // Find all projects
    $groups = getProjectGroups();
    $projectList = array();
    foreach ($groups as $group) {
        $projects = getProjects($group);
        foreach ($projects as $project) {
            $projectData = getProjectData($project);
            array_push($projectList, $projectData);
        }
    }

    // Check clients and aggregate projects
    $tinyProjectList = array();
    foreach($projectList as &$pr){
        checkProject($pr, $projectList);
        $clients = array();
        if (isset($pr['clients']) && !empty($pr['clients'])) {
            foreach ($pr['clients'] as $client) {
                array_push($clients, array("name" => $client['name'], "version" => $client['version']));
            }
        }
        array_push($tinyProjectList, array(
            "name" => $pr['name'],
            "group" => $pr['group'],
            "version" => $pr['version'],
            "versions" => $pr['versions'],
            "errors" => $pr['errors'],
            "clients" => $clients
        ));
    }

    // save projects.json
    $projectsFile = "../" . $_SETTINGS['links']['folder'] . "/projects.json";
    echo "save file: $projectsFile" . PHP_EOL;
    $succeed = file_put_contents($projectsFile, json_encode(array("groups" => $groups, "projects" => $tinyProjectList)));
    if($succeed == false){
        throw new Exception("Failed to save file: " . $_projectFile);
    }

    // trace clients
    for($i = 0; $i < count($projectList); $i++){
        traceClients($projectList[$i], $projectList);
    }
    
    // save _project.json
    foreach($projectList as $project){
        $_projectFile = "../" . $_SETTINGS['links']['folder'] . "/" . $project['group'] . "/" . $project['name'] . "/" . $project['version'] . "/_project.json";
        echo "save file: $_projectFile" . PHP_EOL;
        $succeed = file_put_contents($_projectFile, json_encode($project));
        if($succeed == false){
            throw new Exception("Failed to save file: " . $_projectFile);
        }
    }


//    header('Content-Type: application/json');
    echo json_encode(array("indexing" => "succeed", "groups" => count($groups), "projects" => count($projectList)));
} catch (Exception $e) {
    http_response_code(500);
    throw $e;
}