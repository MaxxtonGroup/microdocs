<?php
/**
 * Get list of all projectgroups with projects.
 * @author Steven Hermans
 */
try {
    require 'core.php';

    $json = getAggregatedProjects(false);
    header('Content-Type: application/json');
    echo $json;
} catch (Exception $e) {
    http_response_code(500);
    throw $e;
}