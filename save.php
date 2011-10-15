<?php

$imagedata = $_POST['imagedata'];
$imagedata = substr($imagedata, strpos($imagedata, ',')+1);
$imagedata = base64_decode($imagedata);

$image = imagecreatefromstring($imagedata);
$watermark = imagecreatefrompng('watermark.png');

imagecopy(
    $image, $watermark,
    imagesx($image) - imagesx($watermark), imagesy($image) - imagesy($watermark),
    0, 0,
    imagesx($watermark), imagesy($watermark)
);

header('Content-Type: image/png;base64');
header('Content-Disposition: attachment; filename=chromatico.png');

imagepng($image);
imagedestroy($image);

