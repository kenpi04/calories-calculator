var app = angular.module("MainApp",[]);

app.controller("HomePageController", ['$scope','$http', function ($scope,$http) {

    var IsBusy=false;
    $scope.CalculateData = [];
    $scope.Total = {
        energ_kcal: 0,
        lipid_tot: 0,
        protein: 0,
        carbohydrt: 0,
        fiber_td: 0,
        sugar_tot: 0

    };
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
    $scope.AddToSubtotal = (item) => {
        $scope.CalculateData.push(item);
        $scope.Total.energ_kcal+= item.energ_kcal*item.quantity;
        $scope.Total.lipid_tot+= item.lipid_tot*item.quantity;
        $scope.Total.protein+=item.protein*item.quantity;
        $scope.Total.carbohydrt+= item.carbohydrt*item.quantity;
        $scope.Total.fiber_td+=item.fiber_td*item.quantity;
        $scope.Total.sugar_tot+=item.sugar_tot*item.quantity;
    }
    $scope.RemoveToSubtotal = (item) => {
        $scope.CalculateData=$scope.CalculateData.filter(x=>x.id!==item.id);
       
        $scope.Total.energ_kcal-= item.energ_kcal*item.quantity;
        $scope.Total.lipid_tot-= item.lipid_tot*item.quantity;
        $scope.Total.protein-=item.protein*item.quantity;
        $scope.Total.carbohydrt-= item.carbohydrt*item.quantity;
        $scope.Total.fiber_td-=item.fiber_td*item.quantity;
        $scope.Total.sugar_tot-=item.sugar_tot*item.quantity;
    }

}]);