<?php
/**
 * Export project to the 'api blueprint' standard
 * @author Steven Hermans
 */
try {
    require 'core.php';
    header('Content-Type: text/plain');

    $json = getAggregatedProjects();
    $projectList = $json['projects'];

    // get project white list
    if (isset($_GET['projects']) && !empty($_GET['projects'])) {
        $projectWhiteList = explode(",", $_GET['projects']);
    } else {
        $projectWhiteList = $_SETTINGS['apiblueprint']['projects'];
    }

    // get group white list
    if (isset($_GET['groups']) && !empty($_GET['groups'])) {
        $groupsWhiteList = explode(",", $_GET['groups']);
    } else {
        $groupsWhiteList = $_SETTINGS['apiblueprint']['groups'];
    }

    // filter projects
    if (!empty($projectWhiteList)) {
        $newArray = array();
        foreach ($projectList as $project) {
            $contains = false;
            foreach ($projectWhiteList as $item) {
                if ($item == $project['name']) {
                    array_push($newArray, $project);
                    $contains = true;
                    break;
                }
            }
        }
        $projectList = $newArray;
    }
    if(!empty($groupsWhiteList)){
        $newArray = array();
        foreach ($projectList as $project) {
            foreach ($groupsWhiteList as $item) {
                if ($item == $project['group']) {
                    array_push($newArray, $project);
                    break;
                }
            }
        }
        $projectList = $newArray;
    }

    // get title
    if (isset($_GET['title']) && !empty($_GET['title'])) {
        $title = $_GET['title'];
    } else {
        $title = $_SETTINGS['apiblueprint']['title'];
    }

    // get host
    if (isset($_GET['host']) && !empty($_GET['host'])) {
        $host = $_GET['host'];
    } else {
        $host = $_SETTINGS['apiblueprint']['host'];
    }

    // get format
    if (isset($_GET['format']) && !empty($_GET['format'])) {
        $format = $_GET['format'];
    } else {
        $format = $_SETTINGS['apiblueprint']['format'];
    }

    // get introduction
    if (isset($_GET['introduction']) && !empty($_GET['introduction'])) {
        $introduction = $_GET['introduction'];
    } else {
        $introduction = $_SETTINGS['apiblueprint']['introduction'];
    }
} catch (Exception $e) {
    http_response_code(500);
    throw $e;
}

// start document

echo "FORMAT: $format" . PHP_EOL;
echo "HOST: $host" . PHP_EOL;
echo PHP_EOL;
echo "# $title" . PHP_EOL;
echo PHP_EOL;
echo $introduction . PHP_EOL;
echo PHP_EOL;

foreach($projectList as $project){
    // load project
    $projectData = getAggregatedProject($project, $project['version']);
    // combine endpoints
    $endpoints = array();
    foreach($projectData['endpoints'] as $endpoint){
        if(!isset($endpoints[$endpoint['path']])){
            $endpoints[$endpoint['path']] = array();
        }
        array_push($endpoints[$endpoint['path']], $endpoint);
    }

    echo "# Group " . $projectData['name'] . PHP_EOL;
    echo PHP_EOL;
    foreach($endpoints as $path => $list){
        if(count($list) > 0){
            echo "## $path" . PHP_EOL;
            echo PHP_EOL;
            foreach($list as $endpoint){
                echo "### " . strtoupper($endpoint['method']) . PHP_EOL;
                echo PHP_EOL;
                echo "+ Request";
                if(isset($endpoint['requestBody']) && !empty($endpoint['requestBody'])){
                    echo " (" . $endpoint['requestBody']['content-type'] . ")";
                }
                echo PHP_EOL . PHP_EOL;
                if(isset($endpoint['requestParams']) && !empty($endpoint['requestParams'])){
                    echo "    + Attributes" . PHP_EOL . PHP_EOL;
                    foreach($endpoint['requestParams'] as $requestParam){
                        echo "        + " . $requestParam['name'];
                        if(isset($requestParam['description']) && !empty($requestParam['description'])){
                            echo ": " . $requestParam['description'];
                        }
                        echo " (" . $requestParam['type'];
                        if(isset($requestParam['required']) && $requestParam['required'] == true){
                            echo ", required";
                        }
                        echo ")" . PHP_EOL . PHP_EOL;
                    }
                }
                if(isset($endpoint['requestBody']) && !empty($endpoint['requestBody'])){
                    echo "    + Body" . PHP_EOL . PHP_EOL;
                    echo renderModel($endpoint['requestBody']['schema'], 12) . PHP_EOL . PHP_EOL;
                    echo "    + Schema" . PHP_EOL . PHP_EOL;
                    echo renderSchema($endpoint['requestBody']['schema'], 12) . PHP_EOL . PHP_EOL;
                }
                if(isset($endpoint['responseBody']) && !empty($endpoint['responseBody'])){
                    echo "+ Response (" . $endpoint['requestBody']['content-type'] . ")" . PHP_EOL . PHP_EOL;
                    echo "    + Body" . PHP_EOL . PHP_EOL;
                    echo renderModel($endpoint['requestBody']['schema'], 12) . PHP_EOL . PHP_EOL;
                    echo "    + Schema" . PHP_EOL . PHP_EOL;
                    echo renderSchema($endpoint['requestBody']['schema'], 12) . PHP_EOL . PHP_EOL;
                }
            }
        }
    }

}


// end document
?>