import React, { Component } from 'react'

export default class LevelDropDown extends Component {
  render() {
    return (
        <div className="relative w-2/5 h-4/6">
        <div className="absolute h-fit -top-4 left-4 px-2 bg-dark-brown text-lg font-light italic text-almost-white text-center ">
            Academic Level 
        </div>
        <select class="w-full pl-3 pt-2 pb-2 bg-transparent border-4 border-light-primary rounded-2xl box-border cursor-pointer" name="level" id="level">
            <option value="freshman">Freshman </option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
        </select>
        
    </div>
    )
  }
}



