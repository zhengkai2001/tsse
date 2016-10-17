<?php

header('Access-Control-Allow-Origin: *');

$context = stream_context_create(array(
    'http' => array(
        'method' => "GET",
        'header' =>
            "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n" .
            "Accept-Language: en-US,en;q=0.8\r\n" .
            "Keep-Alive: timeout=3, max=10\r\n",
        "Connection: keep-alive",
        'user_agent' => "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36",
        "ignore_errors" => true,
        "timeout" => 3
    )
));

if (isset($_GET['url'])) {
    echo file_get_contents($_GET['url'], false, $context);
}

?>