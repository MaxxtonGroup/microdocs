
app.group("home", function(){
    this.leftAction = "icon";
    this.icon = "myapp";
    this.activity_1 = "home-list";
    this.activity_1_type = "large";
    this.activity_2_type = "large";
    this.onLeftAction = function(){
        setTimeout(function(){
            location.href = "../";
        }, 200);
    };
});

app.init();