function fmtestuid()
{
    var uid = document.getElementById("UID").value;
    var Letters = "@.-_";
    var c,f=uid.charAt(0);
    if(uid.length<4||uid.length>32)
    {
	document.getElementById("UID_HB").innerHTML="Too Less/More.";
	document.getElementById("UID").className="input-xlarge error";
	return false;
    }
    else if((f>="A"&&f<="Z")||(f>="a"&&f<="z"))
    {
	for(var i=0;i<uid.length;i++)
	{
	    c=uid.charAt(i);
	    if((c>="A"&&c<="Z")||(c>="a"&&c<="z")||(c>="0"&&c<="9")) {
		document.getElementById("UID_HB").innerHTML="";
		document.getElementById("UID").className="input-xlarge success";
	    }
	    else if(c=="_"||c=="-"||c=="@"||c==".") {
		document.getElementById("UID_HB").innerHTML="";
		document.getElementById("UID").className="input-xlarge success";
	    }
	    else
	    {
		document.getElementById("UID_HB").innerHTML="Invalid characters!";
		document.getElementById("UID").className="input-xlarge error";
		return false;
	    }
	}
	document.getElementById("UID_HB").innerHTML="";
	document.getElementById("UID").className="input-xlarge success";
	return true;
    }
    else
    {
	document.getElementById("UID_HB").innerHTML="Invalid first-characters!";
	document.getElementById("UID").className="input-xlarge error";
	return false;
    }
}

function fmtestfpwd()
{
    var pw1 = document.getElementById("PWD").value;
    if(pw1.length < 6)
    {
	document.getElementById("PWD_HB").innerHTML="Too Less.";
	document.getElementById("PWD").className="input-xlarge error";
	return false;
    }
    else if(pw1.length > 32)
    {
	document.getElementById("PWD_HB").innerHTML="Too Much.";
	document.getElementById("PWD").className="input-xlarge error";
	return false;
    }
    else
    {
	document.getElementById("PWD_HB").innerHTML="";
	document.getElementById("PWD").className="input-xlarge success";
	return true;
    }
}

function fmtestcpwd()
{
    var pw1 = document.getElementById("PWD").value;
    var pw2 = document.getElementById("CPD").value;
    if (pw1==pw2)
    {
	document.getElementById("CPD_HB").innerHTML="";
	document.getElementById("CPD").className="input-xlarge success";
	return true;	
    }
    else
    {
	document.getElementById("CPD_HB").innerHTML="Not matched.";
	document.getElementById("CPD").className="input-xlarge error";
	return false;
    }
}

function fmtestsn()
{
    var sn = document.getElementById("USN").value;
    if(sn.length < 8)
    {
	document.getElementById("USN_HB").innerHTML="Too Less.";
	document.getElementById("USN").className="input-xlarge error";
	return false;
    }
    else if(sn.length > 8)
    {
	document.getElementById("USN_HB").innerHTML="Too Much.";
	document.getElementById("USN").className="input-xlarge error";
	return false;
    }
    for(var i=0;i<name.length;i++)
    {
	if(sn.charAt(i)<"0"||sn.charAt(i)>"9")
	{
	    document.getElementById("USN_HB").innerHTML="Warning: Number Only.";
	    document.getElementById("USN").className="input-xlarge error";
	    return false;
	}
    }
    document.getElementById("USN_HB").innerHTML="";
    document.getElementById("USN").className="input-xlarge success";
    return true;
}

function fmtestem()
{
    var uem = document.getElementById("UEM").value;
    if (uem=null)
    {
	document.getElementById("UEM_HB").innerHTML="Input email.";
	return false;	
    }
    else
    {
	document.getElementById("UEM_HB").innerHTML="";
	return true;
    }
}

function CheckForm()
{
    if (fmtestuid()&&fmtestfpwd()&&fmtestcpwd()&&fmtestsn()&&fmtestem())
    {
	return true;
    }
    else
	return false;
}

function CheckSettingForm()
{
    var opwd = document.getElementById("OPWD").value;
    var fpwd = document.getElementById("PWD").value;
    if (opwd.length==0)
	return false;
    if (fpwd.length!=0&&!(fmtestfpwd()&&fmtestcpwd()))
	return false;
    return true;
}
