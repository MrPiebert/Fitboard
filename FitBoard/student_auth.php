<?php

// Set session lifetime
ini_set('session.gc_maxlifetime', 0.2);

// Start session
session_start();

// Require necessary files
require 'http.php';
require 'oauth_client.php';

// Initialize OAuth client
$client = new OAuth_Client_Class;

// Your configuration block. Register your app on the Student Portal.
// Don't leak your Client Secret. If you do, make sure you regenerate it through the Portal.
$client->redirect_uri = "http://backend-fitboard.wuaze.com/student_auth.php";
$client->client_id = '01hy9zy7azf95bjyn0pn226sx5';
$client->client_secret = 'jOxgsZ4UkCLe8b9-SKwSKftjNu3mQvR6-C2lx8GTqcApOx14jJNOD_RcNpDlbyHOQUMl4MTuNP50BK4O';

// Enable debug mode
$client->debug = 1;
$client->debug_http = 0;

// Configuration for the SBHS API
$api_url = 'https://student.sbhs.net.au/api/';
$client->oauth_version = '2.0';
$client->dialog_url = 'https://student.sbhs.net.au/api/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope={SCOPE}&state={STATE}';
$client->access_token_url = 'https://student.sbhs.net.au/api/token';

// Process OAuth and API requests
$apiResponse = '';
if (($success = $client->Initialize())) {
    if (($success = $client->Process())) {
        if ($client->access_token) {
            $function = 'details/userinfo.json';
            $success = $client->CallAPI(
                $api_url . $function,
                'GET',
                array(),
                array(
                    'FailOnAccessError' => true,
                    'ResponseContentType' => 'unspecified'
                ),
                $apiResponse
            );

            if (!$success) {
                if ($client->response_status == 401) {
                    $client->ResetAccessToken();
                }
            }
        }
    }
    $client->Finalize($success);
}

// Logout functionality
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: home.html');
    exit;
}

// Output API response
if ($client->exit) {
    if ($client->debug) {
        echo $client->debug_output;
    }
    exit;
}

if ($success) {
    $decodedResponse = json_decode($apiResponse);
    $studentData = [
        'username' => $decodedResponse->username,
        'studentId' => $decodedResponse->studentId,
        'givenName' => $decodedResponse->givenName,
        'surname' => $decodedResponse->surname,
        'rollClass' => $decodedResponse->rollClass,
        'yearGroup' => $decodedResponse->yearGroup,
        'role' => $decodedResponse->role,
        'department' => $decodedResponse->department,
        'office' => $decodedResponse->office,
        'email' => $decodedResponse->email,
        'emailAliases' => $decodedResponse->emailAliases,
        'decEmail' => $decodedResponse->decEmail,
        'groups' => $decodedResponse->groups
    ];
    $studentJSON = json_encode($studentData);

    echo '<script>';
    echo 'localStorage.setItem("accessLevel", "0");';
    echo 'localStorage.setItem("studentData", \'' . addslashes($studentJSON) . '\');';
    echo 'window.location.href = "Home_Page/Home_Page.html";';
    echo '</script>';
}


?>

