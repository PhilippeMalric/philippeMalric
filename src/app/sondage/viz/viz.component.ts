import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Sondage } from '../sondage.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.scss']
})
export class VizComponent implements OnInit {

  private svg;
  private margin = 5;
  private width = 200 - (this.margin * 2);
  private height = 100 - (this.margin * 2);
  

  @Input() data : Sondage

  constructor(private eltRef:ElementRef) { }

  ngOnInit(): void {
    console.log("init")
    this.createSvg();
    let d3Data = [
      {cat:"pour",votes:this.data.pour    },
      {cat:"contre",votes:this.data.contre    }
    ]
    this.drawBars(d3Data);


  }


  private createSvg(): void {
    this.svg = d3.select(this.eltRef.nativeElement)
    .select('#bar')
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}

private drawBars(data: any[]): void {
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.cat))
  .padding(0.2);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
let maxH = d3.max(data.map(x=>x.votes))
console.log("maxH",maxH)
  const y = d3.scaleLinear()
  .domain([0, maxH])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => x(d.cat))
  .attr("y", d => y(d.votes))
  .attr("width", x.bandwidth())
  .attr("height", (d) => this.height - y(d.votes))
  .attr("fill", "#d04a35");
}


}
