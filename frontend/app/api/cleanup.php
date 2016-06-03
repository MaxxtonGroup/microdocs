<?php
/**
 * Cleanup old versions of projects
 * @author Steven Hermans
 */
header('Content-Type: application/json');
try {
    require 'core.php';

    $projects = getAggregatedProjects(false);



} catch (Exception $e) {
    http_response_code(500);
    $response = array("status" => "failed", "message" => $e->getMessage());
    exit(json_encode($response));
}
