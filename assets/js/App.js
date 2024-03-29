var app = angular.module("MainApp",[]);

app.controller("HomePageController", ['$scope','$http', function ($scope,$http) {

    var IsBusy=false;
    $scope.CalculateData = [];
    let GetTotal = () => {
        return {
            energ_kcal: 0,
            lipid_tot: 0,
            protein: 0,
            carbohydrt: 0,
            fiber_td: 0,
            sugar_tot: 0

        }
    };
    $scope.Total=GetTotal();
    $scope.Page = {
        PageIndex: 0,
        PageSize: 20
    };
    $scope.Search = () => {
        if(IsBusy)
        return;
         IsBusy=true;
        var dataSearch = {
            PageIndex: $scope.Page.PageIndex,
            PageSize: $scope.Page.PageSize,
            keyword: $scope.Keyword
        };
        var config={
            params:dataSearch
        };
        $http.get('/search', config).then((response)=>{      
            IsBusy=false;  
            $scope.Data = response.data.Items;
        },(err)=>{
            IsBusy=false;
            console.log(err);
        });
    }
    $scope.OnKeywordChange = () => {
        if ($scope.Keyword.length > 0)
            $scope.Search();
    }
    let calulateTotal=()=>{
        $scope.Total=GetTotal();
        $scope.CalculateData.forEach((item)=>{
            $scope.Total.energ_kcal+= item.energ_kcal*item.quantity;
            $scope.Total.lipid_tot+= item.lipid_tot*item.quantity;
            $scope.Total.protein+=item.protein*item.quantity;
            $scope.Total.carbohydrt+= item.carbohydrt*item.quantity;
            $scope.Total.fiber_td+=item.fiber_td*item.quantity;
            $scope.Total.sugar_tot+=item.sugar_tot*item.quantity;
        });
    }
    $scope.AddToSubtotal = (item) => {
        $scope.CalculateData.push(item);
        calulateTotal();
    }
    $scope.RemoveToSubtotal = (item) => {
        $scope.CalculateData=$scope.CalculateData.filter(x=>x.id!==item.id);
       
        calulateTotal();
    }

}]);

app.controller("ZaloController", ['$scope','$http', function ($scope,$http) {

    var IsBusy=false;
    $scope.GetUserId = () => {
        if(IsBusy)
        return;
         IsBusy=true;
        var dataSearch = {
           phone:$scope.Phone
        };
        var config={
            params:dataSearch
        };
        $http.get('/zalo/getuserid', config).then((response)=>{      
            IsBusy=false;  
            $scope.UserId = response;
        },(err)=>{
            IsBusy=false;
            console.log(err);
        });
    }
    

}]);
app.controller("FacebookController", ['$scope','$http', function ($scope,$http) {

    var IsBusy=false;
    $scope.Send = () => {
        if(IsBusy)
        return;
         IsBusy=true;
        var dataPost = {
           Sender:$scope.Sender,
           Msg:$scope.Msg
        };
        var config={
            params:dataPost
        };
        $http.get('/facebook/sendMsg', config).then((response)=>{      
            IsBusy=false;  
            $scope.Status = response;
        },(err)=>{
            IsBusy=false;
            console.log(err);
        });
    }
    

}]);