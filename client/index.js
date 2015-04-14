/* global pokedex:true */
/* jshist camelcase:false */

'use strict';

$(document).ready(init);

function init(){
  $('#pokedex').on('click', '.pokemon:not(.filled)', getPokemon);
  $('#clear').click(clearPokemon);
  $('#pokedex').on('click','.filled',playerSelect);
  $('#fight').click(fight);
  drawPokedex();
}

function fight(){
  var $p1 = $('.p1');
  var $p2 = $('.p2');

  var p1 = {};
  var p2 = {};

  p1.attack = $('.p1').find('li:nth-child(1)').text().split(':')[1] *1;
  p1.defense = $('.p1').find('li:nth-child(2)').text().split(':')[1] * 1;
  p1.exp = $('.p1').find('li:nth-child(3)').text().split(':')[1] * 1;
  p1.hp = $('.p1').find('li:nth-child(4)').text().split(':')[1] * 1;

  p2.attack = $('.p2').find('li:nth-child(1)').text().split(':')[1] * 1;
  p2.defense = $('.p2').find('li:nth-child(2)').text().split(':')[1] * 1;
  p2.exp = $('.p2').find('li:nth-child(3)').text().split(':')[1] * 1;
  p2.hp = $('.p2').find('li:nth-child(4)').text().split(':')[1] * 1;

  hit(p1,p2);
  hit(p2,p1);

  if (p1.hp <= 0){
    $p1.remove();
  }

  if (p2.hp <= 0){
    $p2.remove();
  }

  $('.p1').find('li:nth-child(4)').text('hp:'+p1.hp);
  $('.p2').find('li:nth-child(4)').text('hp:'+p2.hp);

}

function hit(p1,p2){
  var attack = p1.attack * (p1.exp / 100);
  var defense = p2.defense * (p2.exp / 100);
  var final = Math.abs(attack - defense);
  var random = Math.floor(Math.random() * final);
  p2.hp -= random;
  console.log(random);
}

function playerSelect(){
  var $choice = $(this);
  if ($choice.hasClass('p1')){
    $choice.removeClass('p1');
    $choice.addClass('p2');
  } else if ($choice.hasClass('p2')){
    $choice.removeClass('p2');
  } else { $choice.addClass('p1'); }
}

function clearPokemon(){
  $('.pokemon:not(.filled)').remove();
}

function getPokemon(){
  var $self = $(this);

  $self.off('click');
  var uri = $(this).data('uri');
  var domain = 'http://pokeapi.co/';
  var url = domain + uri;
  $.getJSON(url,function(response){

    $self.addClass('filled');
    var $ul = $self.find('ul');
    var attributes = ['attack', 'defense', 'exp', 'hp'];
    var $lis = attributes.map(function(attribute){
      return '<li>' + attribute + ':' + response[attribute] + '</li>';
    });
    $ul.empty().append($lis);


    var spriteUrls = response.sprites.map(function(o){
      return domain + o.resource_uri;
    });
    spriteUrls.forEach(function(url){
      $.getJSON(url,function(response){
        $self.children('.image').css('background-image','url("'+(domain + response.image)+'")');
      });
    });
  });
}

function drawPokedex(){
  pokedex.pokemon.forEach(function(poke){
    var $pokemon = $('<div>');
    var $name = $('<div>');
    var $image = $('<div>');
    var $stats = $('<div>');

    $image.addClass('image');
    $pokemon.addClass('pokemon');
    $pokemon.attr('data-uri',poke.resource_uri);
    $name.addClass('name');
    $name.text(poke.name);
    $stats.addClass('stats');

    var $ul = $('<ul>');
    $stats.append($ul);

    $pokemon.append($name, $image, $stats);
    $('#pokedex').append($pokemon);
  });
}
