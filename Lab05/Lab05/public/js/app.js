$(document).ready(function () {
    var socket = io()
    $('#formulario').submit(function (e) {
      e.preventDefault()
      var data = {
        _id: $('#_id').val(),
        first_name: $('#first_name').val(),
        last_name: $('#last_name').val(),
        timezone: $('#timezone').val(),
        locale: $('#locale').val(),
        profile_pic: $('#profile_pic').val(),
        siOno: $('#siOno').val()
      }
      if (data._id == '') {
        $('#_id').focus()
        return alert('Debe ingresar un ID')
      }
      if (data.first_name == '') {
        $('#first_name').focus()
        return alert('Debe ingresar un nombre!')
      }
      var accion = 'crear'
      if ($('.warning').length > 0) accion = 'actualizar'
      $('.warning').removeClass('warning')
      socket.emit(accion, data)
      $('#formulario').trigger('reset')
      return true
    })
  

    socket.on('nuevo', function (data) {
      fill(data.rpta)
      notificacion(data.rpta._id)
      alert(data.mensaje)
    })
    socket.on('listar', function (data) {
      data = JSON.parse(data)
      for (var i = 0, j = data.length; i < j; i++) {
        fill(data[i])
      }
    })
    socket.on('borrado', function (data) {
        $('#' + data).remove()
      })

    var fill = function (data) {
      if ($('#' + data._id).length == 0) {
        var $row = $('<tr id="' + data._id + '">')
        $row.append('<td>' + data._id + '</td>')
        $row.append('<td>' + data.first_name + '</td>')
        $row.append('<td>' + data.last_name + '</td>')
        $row.append('<td>' + data.timezone + '</td>')
        $row.append('<td>' + data.locale + '</td>')
        $row.append('<td>' + data.profile_pic + '</td>')
        let temp = data.siOno == true ? 'Si' : 'No'
        $row.append('<td>' + temp + '</td>')
        $row.append('<td><button class="btn btn-success btn-sm" name="btnAct">Actualizar</td>')
        $row.append('<td><button class="btn btn-danger btn-sm" name="btnEli">Eliminar</td>')
        $row.data('data', data)
        $row.find('[name=btnAct]').click(function () {
          var data = $(this).closest('tr').data('data')
          $('#_id').val(data._id)
          $('#first_name').val(data.first_name)
          $('#last_name').val(data.last_name)
          $('#timezone').val(data.timezone)
          $('#locale').val(data.locale)
          $('#profile_pic').val(data.profile_pic)
          if (data.siOno) {
            $("#siOno > option[value='true']").attr('selected', true)
            $("#siOno > option[value='false']").attr('selected', false)
          }else {
            $("#siOno > option[value='true']").attr('selected', false)
            $("#siOno > option[value='false']").attr('selected', true)
          }
          $('.warning').removeClass('warning')
          $(this).closest('tr').addClass('warning')
        })
        $row.find('[name=btnEli]').click(function () {
          var _id = $(this).closest('tr').attr('id')
          if (confirm('Continua con la eliminacion de registro?')) {
            socket.emit('eliminar', _id)
          }
        })
        $('table tbody').append($row)
      }else {
        var $row = $('#' + data._id)
        $row.find('td:eq(1)').html(data.first_name)
        $row.find('td:eq(2)').html(data.last_name)
        $row.find('td:eq(3)').html(data.timezone)
        $row.find('td:eq(4)').html(data.locale)
        $row.find('td:eq(5)').html(data.profile_pic)
        let temp = data.siOno == true ? 'Si' : 'No'
        $row.find('td:eq(6)').html(temp)
      }
    }
  })

  
  function notificacion (indice) {
    var duracion = setInterval(notificando, 200)
  
    setTimeout(() => {
      clearInterval(duracion)
    }, 4000)
    function notificando () {
      $('#' + indice).fadeTo(500, .1)
        .fadeTo(500, 1)
        .css('background', '#c1ed63')
    }
  }