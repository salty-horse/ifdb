function doTagCkBox(id, stat)
{
    var i = parseInt(id.substr(5));
    memTagList[i].tagcnt += (stat ? 1 : -1);
    memTagList[i].gamecnt += (memTagList[i].isNew ? (stat ? 1 : -1) : 0);
    memTagList[i].isMine = stat ? 1 : 0;
    var ce = document.getElementById("tagCnt" + i);
    var ct = memTagList[i].tagcnt;
    ce.innerHTML = (memTagList[i].isNew || ct < 2  ? "" :
                    "(x" + memTagList[i].tagcnt + ")");
    ce.title = ct + " member" + (ct > 1 ? "s have" : " has")
               + " tagged this game with \"" + memTagList[i].tag + "\"";
}
function dispTagTable(tableID, lst, editor, deleteTags)
{
    var tbl = document.getElementById(tableID);
    tbl.innerHTML = "";
    var row = null, rownum = 0;
    for (var i = 0 ; i < lst.length ; i++) {
        var t = encodeHTML(lst[i].tag);
        var u = encodeURI8859(lst[i].tag);
        var ct = lst[i].tagcnt;
        var cg = lst[i].gamecnt;
        var m = lst[i].isMine;
        var n = lst[i].isNew;
        var cell = document.createElement("div");
        tbl.appendChild(cell);
        var s;
        if (editor) {

            var ck = "tagCk" + i;


            if (!deleteTags) {
                s = "<span class=\"cklabel\" x-ck='"+i+"'>"
                    + "<img align=absmiddle border=0 id=\"ckImg"+ck+"\"> "
            } else {
               s = "<span class=\"cklabel\" x-ck='"+i+"'>"
                    + "<input type=image align=absmiddle border=0 id=\"ckImg"+ck+"\""
                    + "src='img/delrow.gif' >";

            }

            s += "<span id=\"ckLbl"+ck+"\">" + t + "</span></span>&nbsp;<span class=details id=\"tagCnt"+i+"\">";

        }
        else
            s = "<span class=details title=\"Search for games tagged with "
                + t.replace(/"/g, "&#34;")
                + "\"><a href=\"search?searchfor=tag:"
                + u + "\">"
                + t + "</a>&nbsp;";

        if (!n)
        {
            if (editor)
            {
                s += "<span title=\"" + ct + " member"
                     + (ct > 1 ? "s have" : " has")
                     + " tagged this game with &#34;" + t
                     + "&#34;\">"
                     + (ct > 1 ? "(x" + ct + ")" : "")
                     + "</span></span>";
            }
            else
            {
                s += "<span title=\"" + cg + " game"
                     + (cg > 1 ? "s have" : " has") + " this tag\">(" + cg
                     + ")</span></span>";
            }
        }
        cell.innerHTML = s;
        cell.querySelectorAll('.cklabel').forEach(function (cklabel) {
            var ck = "tagCk" + cklabel.getAttribute('x-ck');
            cklabel.addEventListener('mouseover', function (event) {
                ckboxOver(ck, false);
            });
            cklabel.addEventListener('mouseout', function (event) {
                ckboxLeave(ck, false);
            });
            cklabel.addEventListener('click', function (event) {
                event.preventDefault();
                if (deleteTags) {
                    var tag = lst[cklabel.getAttribute('x-ck')].tag;
                    deleteTag(tag);
                } else {
                    ckboxClick(ck, false, doTagCkBox);
                }
            });
        })

        if (editor)
            ckboxCheck(ck, false, m);
    }
    if (editor && lst.length == 0) {
        tbl.insertRow(0).insertCell(0).innerHTML =
            "<i>This game doesn't have any tags yet.</i>"
    }
}
function dispTags()
{
    var pre = document.getElementById("tagPre");
    if (dbTagList.length == 0)
        pre.innerHTML = "There are no tags associated with this game yet - "
                        + "you can be the first to tag it.";
    else
        pre.innerHTML =
            "The following tags are associated with this game. Click on a tag "
            + "to search for other games with the same tag. ";
    dispTagTable("tagTable", dbTagList, false, false);

    var s = "";
    for (var i = 0 ; i < dbTagList.length ; i++) {
        var t = dbTagList[i];
        if (t.isMine) {
            if (s != "")
                s += ", ";
            s += encodeHTML(t.tag)
        }
    }
    if (s == "")
        s = "(None)";
    var tl = document.getElementById("myTagList");
    if (tl != null)
        tl.innerHTML = s;
}

function dispEditTags()
{
    document.getElementById("tagStatusSpan").innerHTML = "";
    dispTagTable("editTagTable", memTagList, true, false);
}

function dispDeleteTags()
{
    document.getElementById("tagStatusSpan").innerHTML = "";
    dispTagTable("deleteTagTable", memTagList, true, true);
}


function deleteTag(tag)
{
//    alert (tag);

    var c = "id=<?php echo $id ?>";
    c += "&t=" + encodeURI8859(tag);

    //xmlSend("taggamedelete", "tagStatusSpan", cbSaveTags, c);

    for (var j = 0 ; j < memTagList.length ; j++)
    {
        if (memTagList[j].tag == tag)
        {
            var index = j;
            break;
        }
    }

    memTagList.splice (index, 1)
    dispDeleteTags();


}

function editTags()
{
    memTagList = [];
    for (var i = 0 ; i < dbTagList.length ; ++i) {
        var t = dbTagList[i];
        memTagList[i] = {tag: t.tag, tagcnt: t.tagcnt, gamecnt: t.gamecnt,
                         isMine: t.isMine};
    }

    document.getElementById("tagEditor").style.display = "initial";
    dispEditTags();
    document.getElementById("myTagFld").focus();
    fetch('/showtags?datalist=1').then(r=>r.ok ? r.arrayBuffer() : null).then(buffer => {
        if (!buffer) return;
        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(buffer);
        const datalist = document.createElement('datalist');
        document.body.appendChild(datalist);
        datalist.outerHTML = text;
    })
}

function deleteTags()
{
    memTagList = [];
    for (var i = 0 ; i < dbTagList.length ; ++i) {
        var t = dbTagList[i];
        memTagList[i] = {tag: t.tag, tagcnt: t.tagcnt, gamecnt: t.gamecnt,
                         isMine: t.isMine};
    }

    document.getElementById("tagDeletor").style.display = "initial";
    dispDeleteTags();
}


function closeTags(id="tagEditor")
{
    document.getElementById(id).style.display = "none";
}

function saveTags()
{
    addTags();
    dbTagList = [];
    var c = "id=<?php echo $id ?>";
    var i, j, k;
    for (i = j = k = 0 ; i < memTagList.length ; i++)
    {
        var t = memTagList[i];
        if (t.tagcnt != 0)
            dbTagList[j++] = t;
        if (t.isMine)
            c += "&t" + (k++) + "=" + encodeURI8859(t.tag);
    }
    dispTags();
    closeTags("tagEditor");
    xmlSend("taggame", "tagStatusSpan", cbSaveTags, c, true);
}

function saveTagsDelete()
{
//    dbTagList = [];
    var c = "id=<?php echo $id ?>";
    var i, j, k;
    for (i  = k = 0 ; i < dbTagList.length ; i++)
    {
       var t = dbTagList[i];
       var found = false;

       for (j = 0; j < memTagList.length ; j++)
       {
          if (memTagList[j].tag == t.tag) found = true;
       }

       if (!found) c += "&t" + (k++) + "=" + encodeURI8859(t.tag);
    }

    dbTagList = memTagList;

    dispTags();
    closeTags("tagDeletor");
    xmlSend("taggamedelete", "tagStatusSpan", cbSaveTags, c, true);
}


function cbSaveTags(resp)
{
    if (!resp) {
        alert("There was an error saving tags.");
        return;
    }
    if (resp.querySelector("error")) {
        alert(resp.querySelector("error").firstChild.data);
        return;
    }
    var tags = resp.getElementsByTagName("tag");
    for (var i = 0 ; i < tags.length ; ++i)
    {
        var tag = tags[i];
        var name = tag.getElementsByTagName("name")[0].firstChild.data;
        var gamecnt = tag.getElementsByTagName("gamecnt")[0].firstChild.data;
        var tagcnt = tag.getElementsByTagName("tagcnt")[0].firstChild.data;
        name = name.toLowerCase();

        for (var j = 0 ; j < memTagList.length ; j++)
        {
            if (memTagList[j].tag.toLowerCase() == name)
            {
                memTagList[j].gamecnt = parseInt(gamecnt);
                memTagList[j].tagcnt = parseInt(tagcnt);
                memTagList[j].isNew = false;
                break;
            }
        }
    }

    dispTags();
}
function trim(str) { return str.replace(/^\s+|\s+$/g, ''); }
function tagSorter(a, b)
{
    a = a.tag.toLowerCase();
    b = b.tag.toLowerCase();
    return (a > b ? 1 : a < b ? -1 : 0);
}
function addTags()
{
    var fld = document.getElementById("myTagFld");
    if (trim(fld.value) == "")
        return;
    var lst = fld.value.split(",");
    for (var i = 0 ; i < lst.length ; i++)
    {
        var s = trim(lst[i]);
        if (s == "")
            continue;
        var j;
        for (j = 0 ; j < memTagList.length ; j++) {
            var t = memTagList[j];
            if (t.tag == s) {
                if (!t.isMine) {
                    t.tagcnt += 1;
                    t.gamecnt += 1;
                    t.isMine = 1;
                }
                break;
            }
        }
        if (j == memTagList.length)
            memTagList[j] = {tag: s, tagcnt: 1, gamecnt: 1, isMine: 1, isNew: true};
    }
    memTagList.sort(tagSorter);
    dispEditTags();
    fld.value = "";
    fld.focus();
}

