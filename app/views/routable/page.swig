{% extends 'base.swig' %}

{% block title %}{{ name }}{% endblock %}

{% block content %}
	<div id="page_container" class="container-fluid">
		{{ editWidget.create("name", name, {"tag": "h1"}) }}
		<br/>
		{{ editWidget.create("content", content, {"id": "content"}) }}
		<input id="loginButton" type="button" value="Login"/>

		<a data-toggle="modal" href="#myModal" class="btn btn-primary">test modal</a>



		<div class="modal fade" data-backdrop="fullscreen" id="myModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h4 class="modal-title">Modal title</h4>
					</div><div class="container"></div>
					<div class="modal-body">
						Content for the dialog / modal goes here.
						<br>
						<br>
						<br>
						<br>
						<br>
						<a data-toggle="modal" href="#myModal2" class="btn btn-primary">Launch modal</a>
					</div>
					<div class="modal-footer">
						<a href="#" data-dismiss="modal" class="btn">Close</a>
						<a href="#" class="btn btn-primary">Save changes</a>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="myModal2" data-backdrop="transparent">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h4 class="modal-title">Second Modal title</h4>
					</div><div class="container"></div>
					<div class="modal-body">
						Content for the dialog / modal goes here.
					</div>
					<div class="modal-footer">
						<a href="#" data-dismiss="modal" class="btn">Close</a>
						<a href="#" class="btn btn-primary">Save changes</a>
					</div>
				</div>
			</div>
		</div>



	</div>
{% endblock %}