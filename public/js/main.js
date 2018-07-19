$(document).ready(() => {
  $(".delete-todo").on("click", event => {
    const id = $(event.target).attr("data-id");
    $.ajax({
      type: "delete",
      url: "/todo/delete/" + id,
      success: res => {
        window.location.href = "/";
      },
      error: err => {
        console.log(err);
      }
    });
  });
});
