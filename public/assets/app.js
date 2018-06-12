console.log("new app.js linked");


$("#scrape-btn").on("click", function(event) {
	$.post("/api/articles/scrape", data => {}).then(() => {
		window.location.href = "/";
	});
});


$(".save-article-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
	if ($(this).attr("data-saved") === "true") {
		$.post(`/api/articles/${articleId}/unsave`, data => {
			$(this).html('<i class="fa fa-bookmark-o" aria-hidden="true"></i>');
			$(this).attr("data-saved", "false");
		});
	} else {
		$.post(`/api/articles/${articleId}/save`, data => {
			$(this).html('<i class="fa fa-bookmark" aria-hidden="true"></i>');
			$(this).attr("data-saved", "true");
		});
	}
});


$(".view-notes-btn").on("click", function(event) {
	const articleId = $(this).attr("data-article-id");
	
	if ($(`#notes-${articleId}`).attr("data-visible") === "no") {
		$(`#create-note-${articleId}`).show();
		$(`#notes-${articleId}`).slideDown("fast");
		$(`#notes-${articleId}`).attr("data-visible", "yes");
	} else {
	
		$(`#notes-${articleId}`).slideUp("fast");
		$(`#notes-${articleId}`).attr("data-visible", "no");
	}
});


$(".submit-note-btn").on("click", function(event) {
	event.preventDefault();
	const articleId = $(this).attr("data-article-id");
	const noteBody = $(`#note-body-${articleId}`).val();
	$.post(`/api/articles/${articleId}/notes/new`, {
		body: noteBody
	}).then(data => {
		$(`#note-body-${articleId}`).empty();
		const tempNote = `<div class="card-body p-2">
  			<div data-note-id={{this._id}} class="d-inline-block delete-note-btn btn btn-alert"><i class="fa fa-trash-o" aria-hidden="true"></i></div>
  	  		<div class="d-inline-block">
  	  			<h6 class="card-subtitle text-muted ">${noteBody}</h6>
    		</div>
  		</div>`;

		$(`#note-box-${articleId}`).append(tempNote);
		$(`#form-${articleId}`).slideUp("fast");
	});
});


$(".delete-note-btn").on("click", function(event) {
	const noteId = $(this).attr("data-note-id");
	$.post(`/api/notes/${noteId}/delete`, data => {}).then(() => {
		$(`#note-details-${noteId}`).empty();
	});
});
