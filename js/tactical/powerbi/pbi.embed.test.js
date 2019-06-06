// Read embed application token from textbox
var txtAccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkN0ZlFDOExlLThOc0M3b0MyelFrWnBjcmZPYyIsImtpZCI6IkN0ZlFDOExlLThOc0M3b0MyelFrWnBjcmZPYyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYWRmNjZlYjItZmNjZi00MTczLWJmNDQtM2Y3NjczMGFhODllLyIsImlhdCI6MTU1OTc1MzUwNCwibmJmIjoxNTU5NzUzNTA0LCJleHAiOjE1NTk3NTc0MDQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBU1FBMi84TEFBQUFXK3BOM1FqVk83cTJJY0czK2VHbWNQTFo5anlmUGs2UGJQUDA1Z3diMWt3PSIsImFtciI6WyJ3aWEiXSwiYXBwaWQiOiJlYTA2MTZiYS02MzhiLTRkZjUtOTViOS02MzY2NTlhZTUxMjEiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6Ik5pZXRvIiwiZ2l2ZW5fbmFtZSI6Ikxlb25lbCIsImluX2NvcnAiOiJ0cnVlIiwiaXBhZGRyIjoiMTY4LjE3OC4xMjMuMzgiLCJuYW1lIjoiTGVvbmVsIE5pZXRvIiwib2lkIjoiMzM3ZDZlNGYtOGU4Yy00YWRkLWIxMmYtODU1MGE3MzBhNWU2Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTE3OTkwNjMyMTItMTU3NDM2MzE2NS0xODIyNjY3ODY5LTIyNTc0MCIsInB1aWQiOiIxMDAzMDAwMEFCQzg1NTMwIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoibGp3ZmNKeUE4MFd3OGE3dkdhUW83VGE0MkFUQ3JBaGNDbURIYUozenE0WSIsInRpZCI6ImFkZjY2ZWIyLWZjY2YtNDE3My1iZjQ0LTNmNzY3MzBhYTg5ZSIsInVuaXF1ZV9uYW1lIjoibG5pZXRvQHV0YWguZ292IiwidXBuIjoibG5pZXRvQHV0YWguZ292IiwidXRpIjoiMGVVYTBINlZQMGVmQjQ4T2tWLW1BQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYTllYTg5OTYtMTIyZi00Yzc0LTk1MjAtOGVkY2QxOTI4MjZjIl19.bB0lPX6D6h1I-0FdfypLXJK5bFmpdDCra3knjm8kzxZ8vVsM0KoKdN9ngU5zjJ9VtQSMiR_rmPc7_PhFfMHNkBhW1FU685Bvo-HbtVgsWBNP5zOO0kAm9cBfI_R7KKzvrLpxhKBC0kgTe-bbW2FdCTvYOPtKiVE61tw9clghGTQPM5ZQ__DhG6xFUpePpQ6mxlFDfLK_B_yxNcGMDZviXOWDJNeMAIQEP5aOxd_Hy5j6q_PWzd9YbUXBGOpiQOMmXgTcsR6zp1QeOSQXEONh8vl9uqPL4_PWvUwe8TisHqZ5Ve7_YuNAoAtwxHDemfx7BtVQrwk6V0Ugb0K_ykOt2Q";
 
// Read embed URL from textbox
var txtEmbedUrl = "https://app.powerbigov.us/reportEmbed?reportId=2e4a278d-a93e-4f41-9b3c-f3007e45804e&autoAuth=true&ctid=adf66eb2-fccf-4173-bf44-3f76730aa89e";
 
// Read report Id from textbox
var txtEmbedReportId = "2e4a278d-a93e-4f41-9b3c-f3007e45804e";
 
// Read embed type from radio
var tokenType = "0";
 
// Get models. models contains enums that can be used.
var models = window['powerbi-client'].models;
 
// We give All permissions to demonstrate switching between View and Edit mode and saving report.
var permissions = models.Permissions.All;
 
// Embed configuration used to describe the what and how to embed.
// This object is used when calling powerbi.embed.
// This also includes settings and options such as filters.
// You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
var config= {
    type: 'report',
    tokenType: tokenType == '0' ? models.TokenType.Aad : models.TokenType.Embed,
    accessToken: txtAccessToken,
    embedUrl: txtEmbedUrl,
    id: txtEmbedReportId,
    permissions: permissions,
    settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
    }
};
 
// Get a reference to the embedded report HTML element
var embedContainer = $('#embedContainer')[0];
 
// Embed the report and display it within the div container.
var report = powerbi.embed(embedContainer, config);
 
// Report.off removes a given event handler if it exists.
report.off("loaded");
 
// Report.on will add an event handler which prints to Log window.
report.on("loaded", function() {
    Log.logText("Loaded");
});
 
// Report.off removes a given event handler if it exists.
report.off("rendered");
 
// Report.on will add an event handler which prints to Log window.
report.on("rendered", function() {
    Log.logText("Rendered");
});
 
report.on("error", function(event) {
    Log.log(event.detail);
 
    report.off("error");
});
 
report.off("saved");
report.on("saved", function(event) {
    Log.log(event.detail);
    if (event.detail.saveAs) {
        Log.logText('In order to interact with the new report, create a new token and load the new report');
     }
 });
 

 // Get a reference to the embedded report HTML element
var embedContainer = $('#embedContainer')[0];

// Get a reference to the embedded report.
report = powerbi.get(embedContainer);

// Retrieve the page collection and loop through to collect the
// page name and display name of each page and display the value.
report.getPages()
    .then(function (pages) {
      var log = "Report pages:";
      pages.forEach(function(page) {
        log += "\n" + page.name + " - " + page.displayName;
      });
      Log.logText(log);
    })
    .catch(function (error) {
        Log.log(error);
    });