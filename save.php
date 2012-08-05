<?php

$imagedata = $_POST['imagedata'];
$imagedata = substr($imagedata, strpos($imagedata, ',')+1);
$imagedata = base64_decode($imagedata);

$image = imagecreatefromstring($imagedata);
$watermark = imagecreatefrompng('img/watermark.png');

imagecopy(
    $image, $watermark,
    imagesx($image) - imagesx($watermark), imagesy($image) - imagesy($watermark),
    0, 0,
    imagesx($watermark), imagesy($watermark)
);

$filename = "chromatico_" . time() . ".png";

header('Content-Type: image/png;base64');
header('Content-Disposition: attachment; filename=' . $filename);

imagepng($image);
imagedestroy($image);

