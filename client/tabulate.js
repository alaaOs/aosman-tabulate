Template.tabulate.viewmodel({
  sort: 1,
  sortField: "",
  nPages: 0,
  nEntries: 0,
  skip: 0,
  scroll: 0 ,
  page: 1,
  searchQuery: "",
  limit: 10,
  increment: 10,
  query: {},
  searchableColumns: [],
  fields: {},
  tableFields: [],
  subOpts: {},
  tableQuery: {},
  pagingType: "pages",
  getPagingType: function(paging){
    if(this.pagingType() == paging){
      return true;
    }
    return false;
  },
  renderCell: function(entry, col){
    return entry[col];
  },
  returnId(data, col){
    return data._id+col
  },
  renderTmpl: function(tmpl, data, col){
    setTimeout(function () {
      tmplt = Template[tmpl]
      if ($("#"+data._id+col)[0] && tmplt) {
        if (tmplt instanceof Template) {
          if($("#"+data._id+col).children().length<1)
          Blaze.renderWithData(tmplt, {_data:data}, $("#"+data._id+col)[0]);
        }
      }
    }, 100);
  },
  onRendered: function(){
    var _this = this;
    if(this.pagingType() === "infiniteScroll"){
      $('#tabulate-body-wrap').scroll(function(){
        if (_this.templateInstance.subscriptionsReady()) {
          if ($('#tabulate-body').height()- 400 == $(this).scrollTop()) {
            // _this.scroll(_this.scroll()+_this.limit());
            _this.limit(_this.limit()+_this.increment());
          }
        }
      });
    } else if(this.pagingType() === "scroll"){
      $('#tabulate-body-wrap').scroll(function(){
        if (_this.templateInstance.subscriptionsReady()) {
          if ($('#tabulate-body').height()- 400 == $(this).scrollTop()) {
            _this.scroll(_this.scroll()+_this.limit());
            _this.skip(_this.scroll());
            $(this).scrollTop(10)
          }
          if ($(this).scrollTop() == 0 && _this.skip() >0) {
            if (_this.skip() && _this.scroll()) {
              _this.scroll(_this.scroll()-_this.limit());
              _this.skip(_this.scroll());
              $(this).scrollTop(10)
            }
          }
        }
      });
    }
    $('select').material_select();
    searchable = [];
    fields = {};
    tableFields = [];
    _.each(this.options().columns, function(col){
      if (col.data) {
        fields[col.data] = 1
      }
     tableFields.push({data:col.data ,name:col.title, tmpl:col.tmpl, render: col.render});
     if(col.searchable == true){
      searchable.push(col.data)
     }
   });
   this.fields(fields);
   this.searchableColumns(searchable);
   this.tableFields(tableFields);
  },
  retTableFields: function(){
    fields = []
    _.each(this.tableFields(), function(tf){
      fields.push(tf)
    })
    return fields;
  },
  autorun: function(){
    fields = {};
    searchable = [];
    regexQuery = {
      '$regex': '.*' + this.searchQuery() + '.*',
      '$options': 'i'
    };
    tableQuery = {}
    tableQuery["$or"] = [];
    _.each(this.searchableColumns(), function(col){
       tableQuery["$or"].push({[col]: regexQuery});
    })
    options = {
      fields: this.fields(),
      limit: parseInt(this.limit()),
      skip: this.skip()
    }
    if(this.sortField()){
      options["sort"] = {[this.sortField()]:this.sort()};
    } else {
      options["sort"] = {[this.options().defaultSort.field]:this.options().defaultSort.order};
    }
    if(this.options().extraFields){
      _.each(this.options().extraFields, function(field){
        options.fields[field] = 1;
      })
    }
    this.subOpts(options);
    this.tableQuery(tableQuery);
    combinedQuery = tableQuery;
    if (this.query()) {
      combinedQuery = {$and:[tableQuery,this.query()]};
    }
    this.templateInstance.subscribe(this.options().publication, combinedQuery, this.subOpts())
    this.templateInstance.subscribe(this.options().publication+"Count", combinedQuery)
    this.getTotalCount();
    if(this.skip()>0){
      $(".previous-page").removeClass("disabled")
      $(".first-page").removeClass("disabled")
    }
    if(this.skip()==0){
      $(".previous-page").addClass("disabled");
      $(".first-page").addClass("disabled");
    }
    if(this.skip()+parseInt(this.limit())<this.nPages()*this.limit()){
      $(".next-page").removeClass("disabled");
      $(".last-page").removeClass("disabled");
    }
    if(this.skip()+parseInt(this.limit())>=this.nPages()*this.limit()){
      $(".next-page").addClass("disabled");
      $(".last-page").addClass("disabled");
    }
  },
  getTotalCount: function(){
    _this=this;
    options = jQuery.extend(true, [], this.subOpts());
    delete options['limit'];
    delete options['skip'];
    delete options['sort'];

    nEntries = Counts.get(this.options().collection);
    // eval(this.options().collection).find({}).fetch().length;
    _this.nEntries(nEntries);
    perPage = parseInt(_this.limit());
    _this.nPages(Math.ceil(nEntries/perPage));
    if(_this.skip()>nEntries)
    _this.skip(0);

  },
  changePage: function(){
    if (this.page()) {
      this.skip((this.page()-1)*parseInt(this.limit()))
    }
  },
  currentPage: function(){
    return Math.ceil(this.skip()/this.limit())+1;
  },
  entries: function(){
    options = jQuery.extend(true, [], this.subOpts());
    return eval(this.options().collection).find({},{limit: parseInt(this.limit()), sort: options.sort}).fetch();
  },
  formatDate: function(d){
    return moment(d).format("MM/DD/YYYY");
  },
  formatMoney(amount){
    return accounting.formatMoney(amount);
  },
  lastIndex: function(){
    if(this.skip()+parseInt(this.limit()) > this.nEntries())
      return this.nEntries();
    return this.skip()+parseInt(this.limit())
  },
  changeLimit: function(){
    // this.skip()
    if(this.skip()%this.limit() != 0)
      this.skip(Math.floor(this.skip()/this.limit())*parseInt(this.limit()));
    if(this.skip()>0){
      $(".previous-page").removeClass("disabled")
    }
    if(this.skip()==0){
      $(".previous-page").addClass("disabled");
    }
    if(this.skip()+parseInt(this.limit())<this.nPages()*this.limit()){
      $(".next-page").removeClass("disabled");
    }
    if(this.skip()+parseInt(this.limit())>=this.nPages()*this.limit()){
      $(".next-page").addClass("disabled")
    }

  },
  events:{
    "click .next-page"(e){
      if(this.skip()>0){
        $(".previous-page").removeClass("disabled")
      }
      if(this.skip()+parseInt(this.limit())<this.nPages()*parseInt(this.limit())){
        this.skip(this.skip()+parseInt(this.limit()))
      }
      if(this.skip()+parseInt(this.limit())>=this.nPages()*this.limit()){
        $(".next-page").addClass("disabled")
      }
      this.page(Math.ceil(this.skip()/this.limit())+1);
    },
    "click .previous-page"(e){
      if(this.skip()>0)
        this.skip(this.skip()-this.limit())
      if(this.skip()==0){
        $(".previous-page").addClass("disabled");
      }
      if(this.skip()+parseInt(this.limit())<this.nPages()*parseInt(this.limit())){
        $(".next-page").removeClass("disabled");
      }
      this.page(Math.ceil(this.skip()/this.limit())+1);
    },
    "click .first-page"(e){
      $(".first-page").addClass("disabled");
      $(".previous-page").addClass("disabled");
      $(".last-page").removeClass("disabled");
      $(".next-page").removeClass("disabled");
      this.skip(0)
      this.page(1)
    },
    "click .last-page"(e){
      $(".last-page").addClass("disabled");
      $(".next-page").addClass("disabled");
      $(".first-page").removeClass("disabled");
      $(".previous-page").removeClass("disabled");
      this.skip((this.nPages()-1)*parseInt(this.limit()))
      this.page(Math.ceil(this.nEntries()/parseInt(this.limit())))
    },
    "click .sort-col"(e){
      $(".arrow").hide();
      $("th[data-field='"+e.target.getAttribute("data-field")+"'] .arrow").show()

      if(this.sortField()===e.target.getAttribute("data-field")){
        this.sort(-1*this.sort());
        if(this.sort()==-1){
          $(".arrow").hide();
          this.sortField("");
        }
        else
          $("th[data-field='"+e.target.getAttribute("data-field")+"'] .arrow").html("arrow_drop_up")
      } else {
        this.sortField(e.target.getAttribute("data-field"));
        this.sort(-1);
        if(this.sort()==-1)
          $("th[data-field='"+e.target.getAttribute("data-field")+"'] .arrow").html("arrow_drop_down")
        else
          $("th[data-field='"+e.target.getAttribute("data-field")+"'] .arrow").html("arrow_drop_up")
      }
    }
  }
});
