<?php

$imagedata = $_POST['imagedata'];
$imagedata = substr($imagedata, strpos($imagedata, ',')+1);
$imagedata = base64_decode($imagedata);

header('Content-Type: image/png;base64');
header('Content-Disposition: attachment; filename=colortoy.png');

print $imagedata;

