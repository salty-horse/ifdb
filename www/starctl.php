<?php

function showStarCtl($id, $init, $clickFunc, $leaveFunc)
{
    if (!$init)
        $init = 0;

    global $nonce;
    $str = "<div id=\"$id\" class=\"starContainer\" role=\"group\">";
    // Button 0 is required for the CSS subsequent-sibling selectors to work.
    $str .= "<button data-value=\"0\"></button>";
    for ($i = 1; $i <= 5; $i++) {
        $str .= "<button data-value=\"$i\" role=\"button\" aria-label=\"Rate $i out of 5\">";
        $str .= "<svg viewBox=\"0 0 512 512\"><path d=\"M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z\"></path></svg>";
        $str .= "</button>";
    }
    $str .= "</div>";
    $str .= "<script type=\"text/javascript\" nonce=\"$nonce\">\r\n"
           . "<!--\r\n"
           . "initStarCtl('$id', $init, $clickFunc, $leaveFunc);\r\n"
           . "//-->\r\n"
           . "</script>\r\n"
           . "<style nonce='$nonce'>\n"
           . "#$id { vertical-align:middle; cursor:pointer; }\n"
           . "</style>\n";


    return $str;
}

?>
