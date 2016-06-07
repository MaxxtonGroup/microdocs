<?php
/**
 * Export project to the 'swagger 2.0' standard
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
        $projectWhiteList = $_SETTINGS['swagger']['projects'];
    }

    // get group white list
    if (isset($_GET['groups']) && !empty($_GET['groups'])) {
        $groupsWhiteList = explode(",", $_GET['groups']);
    } else {
        $groupsWhiteList = $_SETTINGS['swagger']['groups'];
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
    if (!empty($groupsWhiteList)) {
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

    $projects = array();
    foreach ($projectList as $project) {
        $projectData = getAggregatedProject($project, $project['version']);
        array_push($projects, $projectData);
    }

    // get title
    if (isset($_GET['title']) && !empty($_GET['title'])) {
        $title = $_GET['title'];
    } else {
        $title = $_SETTINGS['info']['title'];
    }

    $version = $_SETTINGS['info']['version'];
    $schemas = $_SETTINGS['info']['schemas'];
    $host = $_SETTINGS['info']['host'];
    $basePath = $_SETTINGS['info']['basePath'];
    $termsOfService = $_SETTINGS['info']['termsOfService'];
    $contactName = $_SETTINGS['info']['contactName'];
    $contactUrl = $_SETTINGS['info']['contactUrl'];
    $contactEmail = $_SETTINGS['info']['contactEmail'];
    $licenseName = $_SETTINGS['info']['licenseName'];
    $licenseUrl = $_SETTINGS['info']['licenseUrl'];

    // get description
    if (isset($_GET['desc']) && !empty($_GET['desc'])) {
        $description = $_GET['introduction'];
    } else {
        $description = $_SETTINGS['info']['description'];
    }
} catch (Exception $e) {
    http_response_code(500);
    throw $e;
}

// start document
$swagger = array(
    "swagger" => "2.0",
    "info" => array(
        "title" => $title,
        "description" => $description,
        "termsOfService" => $termsOfService,
        "version" => $version,
        "contact" => (empty($contactName) && empty($contactUrl) && empty($contactEmail) ? null : array(
            "name" => $contactName,
            "email" => $contactEmail,
            "url" => $contactUrl
        )),
        "license" => (empty($licenseName) && empty($licenseUrl) ? null : array(
            "name" => $licenseName,
            "url" => $licenseUrl
        ))
    ),
    "host" => $host,
    "basePath" => $basePath,
    "schemas" => $schemas
);

$tags = array();
foreach ($projects as $project){
    $tag = array(
        "name" => $project['name']
    );
    if(isset($project['description']) && !empty($project['description'])){
        $tag['description'] = $project['description'];
    }
    array_push($tags, $tag);
}
$swagger['tags'] = $tags;

$definitions = array();
foreach ($projects as $project){
    foreach(value($project, "models", array()) as $model){
        $plainModel = stripModel(collectSuperModel($model, value($project, "models", array())));
        $resolvedModel = collectModel($model, value($project, "models", array()));
        $name = value(value($resolvedModel, 'classType'), 'name');
        $definitions[$name] = $plainModel;
    }
}
$swagger['definitions'] = $definitions;

$paths = array();
foreach ($projects as $project){
    // combine endpoints
    $endpoints = array();
    foreach(value($projectData, 'endpoints', array()) as $endpoint){
        if(!isset($endpoints[$endpoint['path']])){
            $endpoints[$endpoint['path']] = array();
        }
        array_push($endpoints[$endpoint['path']], $endpoint);
    }
    foreach($endpoints as $path => $list){
        $methods = array();
        foreach($list as $endpoint){
            $params = array();
            foreach(value($endpoint, 'requestParams', array()) as $pathVariable){
                array_push($params, array(
                    "name" => value($pathVariable, 'name'),
                    "description" => value($pathVariable, 'description'),
                    "required" => value($pathVariable, 'required'),
                    "in" => "query",
                    "default" => value($pathVariable, 'defaultValue')
                ));
            }
            foreach(value($endpoint, 'pathVariables', array()) as $pathVariable){
                array_push($params, array(
                    "name" => value($pathVariable, 'name'),
                    "description" => value($pathVariable, 'description'),
                    "required" => true,
                    "in" => "path"
                ));
            }
            $requestBody = value($endpoint, 'requestBody');
            if($requestBody != null){
                $model = stripModel(collectSuperModel($requestBody, value($project, 'models', array())));
                $resolvedModel = collectModel($requestBody, value($project, 'models', array()));
                $name = value(value($resolvedModel, 'classType'), 'simpleName');
                array_push($params, array(
                    "name" => $name,
                    "in" => "body",
                    "description" => value($resolvedModel, 'description'),
                    "schema" => $model,
                    "required" => true
                ));
            }

            $responses = array(
                "default" => array(
                    "description" => "Response when the request has succeed"
                )
            );
            if(isset($endpoint['responseBody']) && !empty($endpoint['responseBody'])){
                $responses['default']['schema'] = $endpoint['responseBody'];
                $contentType = value($endpoint, 'consumes', array("application/json"))[0];
                $responses['default']['examples'] = array(
                    $contentType =>  getModel($endpoint['responseBody'])
                );
            }
            foreach(value($endpoint, 'responses', array()) as $response){
                $responses[$response['status']] = array(
                    "description" => value($response, 'description')
                );
            }

            $methods[strtolower($endpoint['method'])] = array(
                "tags" => array($project['name']),
                "description" => value($endpoint, 'description'),
                "operationId" => strtoupper($endpoint['method'])."#".$endpoint['path'],
                "consumes" => value($endpoint, 'consumes', array()),
                "produces" => value($endpoint, 'produces', array()),
                "parameters" => $params,
                "responses" => $responses
            );
        }
        $paths[$path] = $methods;
    }
}
$swagger['paths'] = $paths;

echo json_encode($swagger);

// end document
?>
