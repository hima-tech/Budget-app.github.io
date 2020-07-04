

// BUDGET CONTROLLER

var budgetController = (function(){
 
// function constructor
    
var Expense = function(id, description, value){
    
    this.id = id;
    
    this.description = description;
    
    this.value = value;
    
    this.percentage = -1;
}; 

var Income = function(id, description, value){
    
    this.id = id;
    
    this.description = description;
    
    this.value = value;    
    
};
    
Expense.prototype.calcPercentage = function(totalIncome){
    if (totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100); 
    }else {
     this.percentage = -1;   
    }
    
};    
    
Expense.prototype.getPerc = function(){
    return this.percentage;
};    
    

var calculateTotal = function(type){
    
    var sum = 0;
    
    data.allitem[type].forEach(function(curr){
     
    // sum = sum + curr.value    
      sum += curr.value;  
        
    });
   
    /*
    
    [200, 400, 100]
    
    sum = 0 + 200
    sum = 200 + 400
    sum = 600 + 100
    sum = 600
    
    */
    
    // stored on my global data structure
    
    data.totals[type] = sum;
};




// DATA Structors

var data = {
allitem: {
    inc: [],
    exp: []
    
},

totals: {
    inc: 0,
    exp: 0
},
budget: 0,         
    
percentage: -1    
    
    
    
};

    return {
        
    additem: function(type, des, val) {
      var newItem, ID;
        

        
    if (data.allitem[type].length > 0){
        
      ID = data.allitem[type][data.allitem[type].length - 1].id + 1;   
    }else  {
        
        ID = 0;
    }    
        
    // create new item based on 'inc' and 'exp' type    
        
    if ( type === 'exp')  {
      
    newItem = new Expense(ID, des, val);  
        
    }else if (type === 'inc'){
        
    newItem = new Income(ID, des, val);
    }  
        
    // push it into my data structure    
        
      data.allitem[type].push(newItem);
         
        
    // return the new element    
        return newItem;
      

    },
        
    deleteItem: function(type, id){
     var ids, index;
        /// map creating new array
        
    ids = data.allitem[type].map(function(current){
            return current.id;
            
        });
        // index number of the item
     index = ids.indexOf(id);
    
    if (index !== -1){
        
        // splice is remove , first agrument is postion number we want to delete and secound what number of elements we want to delete
        
        data.allitem[type].splice(index, 1);
    } 
        
    },
        
    calculatePercentage: function(){
        
        
        
        data.allitem.exp.forEach(function(cur){
           
            cur.calcPercentage(data.totals.inc);
            
        });
        
    },    
    
    getPercent : function(){
      var getpercentage = data.allitem.exp.map(function(curr){
        
        return  curr.getPerc();
          
      });
    return getpercentage;
    },    
        
    calculatebudget: function(){
        
    // calculate total income and expense
       
    calculateTotal('exp');
        
    calculateTotal('inc');    
        
        
    // calculate the budget income - expenses
        
    data.budget = data.totals.inc - data.totals.exp;    
        
        
    // calculate the percentage at income that we spent     
     if (data.totals.inc > 0){
         
               
        
    data.percentage = Math.round((data.totals.exp / data.totals.inc ) * 100);
     }else {
        
        data.percentage = -1; 
         
     }
      
      
        
    },
  
    getBudget: function(){
        return {
         budget: data.budget,
         income: data.totals.inc,
         expense: data.totals.exp,
         percentage: data.percentage
            
        };  
        
    },
    test: function(){
        
      console.log(data);  
    },    
        
    };
    

    
})();





// User Interface Controller MODULE


var uiController = (function() {
  
// Public Method 
    
var dOMstrings = { 
    
    inputype:'.add__type',
    
    inputDes:'.add__description',
    
    inputValue:'.add__value',
    
    inputaddButton:'.add__btn',
    
    incomeContainer:'.income__list',
    
    expenseContainer:'.expenses__list',
    
    budgetLabel:'.budget__value',
    
    incomeLabel:'.budget__income--value',
    
    expenseLabel:'.budget__expenses--value',
    
    percentageLabel:'.budget__expenses--percentage',
    
    container:'.container',
    
    EXPpercentange:'.item__percentage',
    
    dayTime:'.budget__title--month'
};    
    
    
var formatNumber = function(num, type){
      var numSplit, init, dec, type;
        num = Math.abs(num);
        
        
        num = num.toFixed(2);
        
       
        numSplit = num.split('.');
        init = numSplit[0];
        if (init.length > 3){
            
        init = init.substr(0, init.length - 3) + ',' + init.substr(init.length - 3 , 3);
            
        }
        
        
        
        dec = numSplit[1];
        
        

        if (type === 'exp'){
            
            type = '-';
        }else {
            
            type = '+';
        }
    
    
        
    
    
        return type + ' ' + init + '.' + dec;
        
    }; 
    
    
    return {
        getinput: function() {
          return {
 type: document.querySelector(dOMstrings.inputype).value, // we will get income (+) or exp (-)
        
 description: document.querySelector(dOMstrings.inputDes).value,
// parseFloat change a STRING into Number 
 value: parseFloat(document.querySelector(dOMstrings.inputValue).value)           
                         
              
          };
        },
        
    
        addlistitem: function(obj, type){
          
            
            var html, newhtml, element;
           
        
        //  create HTML string with placeholder text 
           
            if (type === 'inc'){
               
              element = dOMstrings.incomeContainer;
                  
        
               html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';  
            }else if (type === 'exp'){
              
                element = dOMstrings.expenseContainer;
                
               html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }
                 
            // replace the placeholder text with  some actual data 
            
                
           // i want to replace the obj with id , descriotion and value    
            newhtml = html.replace('%id%', obj.id);
            
            // newhtml because html already signed with the first newhtml 
            
            newhtml = newhtml.replace('%description%', obj.description);
            
            newhtml = newhtml.replace('%value%', formatNumber(obj.value, type));
            
            
        // insert the HTML into DOM
         
        document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
                
            
        },
       
        
        
        clearFields: function() {
        
            var fields, fieldsArray, arr;
    fields = document.querySelectorAll(dOMstrings.inputDes + ', ' + dOMstrings.inputValue);    
     
   
           
            
    fieldsArray = Array.prototype.slice.call(fields);
    
        
    fieldsArray.forEach(function(custom, index, arr){
        custom.value = "";           });
        
    // making the typing start from the description array 
              
    fieldsArray[0].focus();        
            
          
    },
        
    deleteListITem: function(selectorID){
       
    // remove method that doesnt work with internet explorer    
        
    var el  = document.getElementById(selectorID).remove(el);
        
        
        /* var el;
        el = document.getElementById(selectorID);
        
        el.parentNode.removeChild(el);
        */
    },    
        
    displaybudget: function(obJ){
       var type;
        
        // ternary operator
    obJ.budget > 0 ? type = 'inc' : type = 'exp';   
        
    document.querySelector(dOMstrings.budgetLabel).textContent = formatNumber(obJ.budget, type);
    document.querySelector(dOMstrings.incomeLabel).textContent = formatNumber(obJ.income, 'inc');
    document.querySelector(dOMstrings.expenseLabel).textContent = formatNumber(obJ.expense, 'exp');
    
   
    if (obJ.percentage > 0){
        
        document.querySelector(dOMstrings.percentageLabel).textContent = obJ.percentage + '%';
    } else {
        document.querySelector(dOMstrings.percentageLabel).textContent = '---';
    }
    
    
    },
         
       
displayPercentages: function(percentages) {
    var fields = document.querySelectorAll(dOMstrings.EXPpercentange);
 
var nodeListForEach = function (list) {
    for (var i = 0; i < list.length; i++) {
        if (percentages[i] > 0) {
            list[i].textContent = percentages[i] + '%';
        } else {
            list[i].textContent = '---';
        }
    }
}
nodeListForEach(fields);
 
}, 
     // this how i set the date 
   time: function(){
       
       document.querySelector(dOMstrings.dayTime).textContent = new Date().toLocaleDateString('en-EG', { month: 'long', day: 'numeric', year: 'numeric' });
 
   },
        
    colorRed: function(){
    
        document.querySelector(dOMstrings.inputype).classList.toggle('red-focus');
        document.querySelector(dOMstrings.inputDes).classList.toggle('red-focus');
        document.querySelector(dOMstrings.inputValue).classList.toggle('red-focus');
        document.querySelector(dOMstrings.inputaddButton).classList.toggle('red');
    },    
        publicinput: function() {
        return  dOMstrings;
    }   
        
        
    };
    
    
})();



// third module to have the other 2 modules connected 



// global app controller 

var appController = (function(BudgetCtrl, UiCtrl){
    

    
// ADDING EVENT LISTNERS TO A FUNCTION TO KEEP THE CODE CLEAN     
    
var getEventListners = function() {
   
 var dom = UiCtrl.publicinput();   
    
    
document.querySelector(dom.inputaddButton).addEventListener('click',addBtn);   
   
    
// keyperss makes any button on the keyboard works like click 
  
    
document.addEventListener('keypress', function(e){

   
    
// keycode and switch are the same but switch for older browsers, || = and
  
    
if (e.keyCode === 13 || e.which === 13){
   
    addBtn();
    
}
        
});    
    
   
 
document.querySelector(dom.container).addEventListener('click',ctrlDeleteItem);   

document.querySelector(dom.inputype).addEventListener('change', UiCtrl.colorRed);    

};
 
     
    
// DO NOT REPEAT YOURSELF Principle 
    
var  updateBudget = function(){
  
// 1. calculate the budget

BudgetCtrl.calculatebudget();    
    
// 2.return budget     
    
var budgetReturn = BudgetCtrl.getBudget();   
    
// 3. display the budget on the UI
    
 UiCtrl.displaybudget(budgetReturn);    
};   
  

    
    
 var updatePercentages = function(){
     
    // 1- calculate percentages
     BudgetCtrl.calculatePercentage();
     
    // 2- read percentages from budgetCTRL 
     var percentage = BudgetCtrl.getPercent();
     
    // 3-  update UI interface with the new percentages
     UiCtrl.displayPercentages(percentage);
 };   
    
    
 
    
   var addBtn = function(){
   
    var input, newitem, UIitem;   
    
  // 1. get the field input data
   
    input = UiCtrl.getinput();
    
       

if (input.description !== '' && !isNaN(input.value) && input.value > 0){
    
  // 2. add the item to the ui
    
    newitem = BudgetCtrl.additem(input.type, input.description, input.value);  
       
  // 3.add the item to the ui
    
   UIitem = UiCtrl.addlistitem(newitem, input.type);
   
  // 4. clear space 
       
    UiCtrl.clearFields();   
       
  // 5.calculate and update Budget 
    updateBudget();
    
  //6- calculate and update percentages  
    updatePercentages();
}     
  };

   
    
    
var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
    if (itemID) {
        // split do remove the - between income and ID number and make them an ARRAY
        splitID = itemID.split('-');
        
        // type is the inc or exp as an array = 0 as first
        type = splitID[0];
         
        // ID is the number id in the array = 1 as secound
        ID = parseInt(splitID[1]);
       
        // 1 - delete the item from the data structure (var budget controller)
        BudgetCtrl.deleteItem(type, ID);
      
        // 2- delete the item from the ui interface (var ui controller)
        UiCtrl.deleteListITem(itemID);
        
        // 3- update and show the new budget
        updateBudget();
        
        // 4- calculate and update percentages  
        updatePercentages();
        
    }
    
};       
 
  

      
 
    

return {
    init: function() {
       
        UiCtrl.time();
        var dom = UiCtrl.publicinput(); 
    document.querySelector(dom.budgetLabel).textContent = '';
    
        
        getEventListners();
        
         UiCtrl.displaybudget({
         budget: 0,
         income: 0,
         expense: 0,
         percentage: -1});    
    }
}    

    
    
    
})(budgetController, uiController);




// so it can be public and out of the IFIE

appController.init();
 


