<?php
/**
 * Get list of all projectgroups with projects.
 * @author Steven Hermans
 */
header('Content-Type: application/json');
try {
    require 'core.php';

    $json = getAggregatedProjects(false);
    echo $json;
} catch (Exception $e) {
    http_response_code(500);
    $response = array("status" => "failed", "message" => $e->getMessage());
    exit(json_encode($response));
}
