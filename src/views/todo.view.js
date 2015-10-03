// -*- coding: utf-8 -*-

function todo_list_view(){
    return <div class="list-group-item">
      <div class="row">
        <div class="col-xs-1 col-md-1">
          <div class="todo-embrem-wrapper">
            <a href="#" class="todo-embrem">
              <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
            </a>
          </div>
        </div>

        <div class="col-xs-9 col-md-9">
          <span href="#">a hour ago</span>
          <p><a href="#">todo title</a></p>
          <p href="#">description</p>
        </div>

        <div class="col-xs-1 col-md-1">
          <span class="glyphicon glyphicon-tags" aria-hidden="true"></span>
          <span class="glyphicon glyphicon-tags" aria-hidden="true"></span>
          <span class="glyphicon glyphicon-tags" aria-hidden="true"></span>
        </div>
        <div class="col-xs-1 col-md-1">
          <span class="glyphicon glyphicon-fire" aria-hidden="true"></span>
          <span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
          <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
          <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>
        </div>
      </div>
   </div>
};
