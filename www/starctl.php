<?php

function showStarCtl($id, $init, $clickFunc, $leaveFunc)
{
    if (!$init)
        $init = 0;

    global $nonce;
    $str = "<div id=\"$id\" class=\"starContainer\" role=\"radiogroup\">";
    // Radio button 0 is required for the CSS subsequent-sibling selectors to work.
    // 'checked' is set here to avoid flashing when the page is loaded
    $str .= "<input type=\"radio\" name=\"$id\" value=\"0\">";
    for ($i = 1; $i <= 5; $i++) {
        $str .= "<input type=\"radio\" id=\"$id-$i\" name=\"$id\" value=\"$i\">";
        $str .= "<label for=\"$id-$i\" aria-label=\"Rate $i out of 5\"><svg viewBox=\"0 0 512 512\"><path d=\"M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z\"></path></svg></label>";
    }
    $str .= "</div>";
    $str .= "<script type=\"text/javascript\" nonce=\"$nonce\">\r\n"
           . "<!--\r\n"
           . "initStarCtl('$id', $init, $clickFunc);\r\n"
           . "//-->\r\n"
           . "</script>\r\n"
           . "<style nonce='$nonce'>\n"
           . "#$id { vertical-align:middle;cursor:pointer; display: inline; }\n"
           . "</style>\n";


    return $str;
}

?>
