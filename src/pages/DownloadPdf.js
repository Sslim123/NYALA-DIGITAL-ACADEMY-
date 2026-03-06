import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"

const downloadPDF =  async () => {

  const element = document.getElementById("certificate")

  const canvas = await html2canvas(element)

  const imgData = canvas.toDataURL("image/png")

  const pdf = new jsPDF("landscape", "px", "a4")

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

  pdf.save("certificate.pdf")
}
export default downloadPDF;