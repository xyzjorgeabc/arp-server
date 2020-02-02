import { keysToLC, get_imp, get_base, get_total } from '../utils/utils';
import { AlbaranCompra, RegistroAlbaranCompra, Serie, Empresa, Proveedor, Cliente, AlbaranVenta, FacturaVenta, UkObject, FacturaCompra } from '../utils/interfaces';

export function writeRegistrosAlbaran(doc: PDFKit.PDFDocument, regs: RegistroAlbaranCompra[]){

  const VERTICAL_SPACE = 30; // 10 registros
  const REGSXPAGES = Math.floor(325 / 30);
  const DESCWIDTH = 200;
  const NUMSWIDTH = 97;
  let pages = Math.ceil(regs.length / REGSXPAGES);

  while (doc.bufferedPageRange().count < pages) doc.addPage();

  doc.fontSize(10);
  doc.fillColor('#000');

  for (let i = 0; i < regs.length; i++) {
    const precio = (regs[i].precio_coste * (1 - regs[i].descuento / 100)).toFixed(3);
    const importe = (+precio * regs[i].cantidad).toFixed(3);

    !(i % REGSXPAGES) && doc.switchToPage( Math.floor(i / REGSXPAGES) );

    doc.lineCap('butt')
    .rect(50, 290, 512, 350)
    .stroke();

    doc.text(regs[i].nombre_registro, 70, 335 + (i % REGSXPAGES * VERTICAL_SPACE ), {
      height: 20,
      width: DESCWIDTH,
      align: 'left',
      baseline: 'middle'
    });

    doc.text(regs[i].cantidad + '', 270, 335 + (i % REGSXPAGES * VERTICAL_SPACE ), {
      height: 20,
      width: NUMSWIDTH,
      align: 'center',
      baseline: 'middle'
    });

    doc.text(precio,
    367, 335 + (i % REGSXPAGES * VERTICAL_SPACE ), {
      height: 20,
      width: NUMSWIDTH,
      align: 'center',
      baseline: 'middle'
    });

    doc.text( importe,
    465, 335 + (i % REGSXPAGES * VERTICAL_SPACE ), {
      height: 20,
      width: NUMSWIDTH,
      align: 'center',
      baseline: 'middle'
    });
  }

  doc.switchToPage(0);

}

export function drawProveedor(doc: PDFKit.PDFDocument, proveedor: Proveedor) {
  doc.lineWidth(1);
  doc.fontSize(10);
  doc.fillColor('#000000');

  doc.lineCap('butt')
  .rect(286, 50, 276, 150)
  .stroke();

  doc.text(proveedor.nombre, 296, 65, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(proveedor.cif, 296, 85, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(proveedor.email, 296, 105, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(proveedor.direccion, 296, 125, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(proveedor.telefono, 296, 145, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(proveedor.fax, 366, 145, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });

}

export function drawEmpresa(doc: PDFKit.PDFDocument, empresa: Empresa){
  doc.lineWidth(1);
  doc.fontSize(10);
  doc.fillColor('#000000');

  doc.text(empresa.nombre_comercial, 50, 65, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(empresa.cif, 50, 85, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(empresa.email, 50, 105, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(empresa.direccion, 50, 125, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(empresa.telefono, 50, 145, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(empresa.fax, 120, 145, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
}

export function drawAlbaranCompraInfo(doc: PDFKit.PDFDocument, albaran: AlbaranCompra, serie: Serie) {
  doc.lineWidth(1);
  doc.fontSize(10);

  doc.rect(50, 220, 512, 25)
  .fillOpacity(0.8)
  .fill("#D3D3D3");

  doc.lineCap('butt')
  .rect(50, 220, 512, 50)
  .stroke();

  doc.moveTo(50, 245)
  .lineTo(562, 245)

  doc.moveTo(178, 220)
  .lineTo(178, 270)

  doc.moveTo(306, 220)
  .lineTo(306, 270)

  doc.moveTo(434, 220)
  .lineTo(434, 270)
  
  doc.lineCap('butt')
  .rect(50, 290, 512, 350)
  .stroke();
  doc.fillColor('#000000');
  doc.text('Fecha', 50, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(albaran.fecha, 50, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Serie', 178, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(serie.nombre, 178, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('ID', 306, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(albaran.id + '', 306, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Numero albarán', 434, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(albaran.id_albaran_proveedor, 434, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })

}

export function drawTotalesAlbaran(doc: PDFKit.PDFDocument, albaran: AlbaranCompra | AlbaranVenta) {

  const impuestos = get_imp(albaran.registros);
  const imp_base = get_base(albaran.registros).toFixed(2);
  const total = get_total(albaran.registros, albaran.descuento_general).toFixed(2);
  doc.lineWidth(1);
  doc.fontSize(10);

  doc.rect(50, 660, 512, 25)
  .fillOpacity(0.8)
  .fill("#D3D3D3");

  doc.lineCap('butt')
  .rect(50, 660, 512, 50)
  .stroke();

  doc.strokeColor('#000');
  doc.moveTo(50, 685)
  .lineTo(562, 685);

  doc.moveTo(152, 660)
  .lineTo(152, 710);

  doc.moveTo(255, 660)
  .lineTo(255, 710);

  doc.moveTo(357, 660)
  .lineTo(357, 710);

  doc.moveTo(460, 660)
  .lineTo(460, 710);

  doc.stroke();
  doc.fillColor('#000000');
  doc.text('4%', 50, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(impuestos['4'] ? impuestos['4'].toFixed(2) : 0 + '', 50, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

  doc.text('10%', 152, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(impuestos['10'] ? impuestos['10'].toFixed(2) : 0 + '', 152, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  
  doc.text('21%', 255, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(impuestos['21'] ? impuestos['21'].toFixed(2) : 0 + '', 255, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

  doc.text('Base', 357, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(imp_base + '', 357, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

  doc.text('Total', 460, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(total + '', 460, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

}

export function drawEmptyRegsTable(doc: PDFKit.PDFDocument){
  doc.lineWidth(1);
  doc.fontSize(10);

  doc.rect(50, 290, 512, 25)
  .fillOpacity(0.8)
  .fill("#D3D3D3");

  doc.strokeColor('#000');
  doc.moveTo(50, 315)
  .lineTo(562, 315);

  doc.moveTo(270, 290)
  .lineTo(270, 315);

  doc.moveTo(367, 290)
  .lineTo(367, 315);

  doc.moveTo(465, 290)
  .lineTo(465, 315);

  doc.stroke();
  doc.fillColor('#000000');
  doc.text('Descripción', 50, 302, {
    width: 220,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Cantidad', 270, 302, {
    width: 97,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Precio', 367, 302, {
    width: 97,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Importe', 465, 302, {
    width: 97,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })

}

export function drawPageN(doc: PDFKit.PDFDocument, actualPage: number, pages: number) {

  doc.text( 'Página ' + actualPage + ' de ' + pages + '.', 500, 750, {
    width: 100,
    height: 25,
    align: 'left',
    baseline: 'middle',
  })
  doc.stroke();
}

export function drawCliente(doc: PDFKit.PDFDocument, cliente: Cliente) {
  doc.lineWidth(1);
  doc.fontSize(10);
  doc.fillColor('#000000');

  doc.lineCap('butt')
  .rect(286, 50, 276, 150)
  .stroke();

  doc.text(cliente.nombre_comercial, 296, 65, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(cliente.cif, 296, 85, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(cliente.email, 296, 105, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(cliente.direccion, 296, 125, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(cliente.telefono, 296, 145, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });
  doc.text(cliente.fax, 366, 145, {
    height: 20,
    width: 410,
    align: 'left',
    baseline: 'middle'
  });

}

export function drawAlbaranVentaInfo(doc: PDFKit.PDFDocument, albaran: AlbaranVenta, serie: Serie) {
  doc.lineWidth(1);
  doc.fontSize(10);

  doc.rect(50, 220, 512, 25)
  .fillOpacity(0.8)
  .fill("#D3D3D3");

  doc.lineCap('butt')
  .rect(50, 220, 512, 50)
  .stroke();

  doc.moveTo(50, 245)
  .lineTo(562, 245)

  doc.moveTo(178, 220)
  .lineTo(178, 270)

  doc.moveTo(306, 220)
  .lineTo(306, 270)

  doc.moveTo(434, 220)
  .lineTo(434, 270)
  
  doc.lineCap('butt')
  .rect(50, 290, 512, 350)
  .stroke();
  doc.fillColor('#000000');
  doc.text('Fecha', 50, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(albaran.fecha, 50, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Serie', 178, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(serie.nombre, 178, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('ID', 306, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(albaran.id + '', 306, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })

}

export function writeRegistrosFactura(doc: PDFKit.PDFDocument, albaranes: Array<AlbaranVenta | AlbaranCompra>){

  const VERTICAL_SPACE = 30; // 10 registros
  const REGSXPAGES = Math.floor(325 / 30);
  const DESCWIDTH = 200;
  const NUMSWIDTH = 97;
  let pages = albaranes.reduce(function(val: number, albaran: AlbaranVenta | AlbaranCompra): number{
    return val + Math.ceil(albaran.registros.length / REGSXPAGES);
  }, 0);

  while (doc.bufferedPageRange().count < pages) doc.addPage();
  doc.switchToPage(0);
  doc.fontSize(10);
  doc.fillColor('#000');
  
  let rowIndex = 0;

  for( let j = 0; j < albaranes.length; j++ ){
    const row = rowIndex % REGSXPAGES * VERTICAL_SPACE;
    const regs = albaranes[j].registros;
    
    doc.rect(50, 325 + row, 512, 20)
    .fillOpacity(0.4)
    .fill("#D3D3D3");
    doc.fillColor('#000');
    doc.fillOpacity(1);

    doc.text( 'Serie: ', 70, 335 + row, {
      height: 20,
      width: 30,
      align: 'left',
      baseline: 'middle'
    });

    doc.text(albaranes[j].id_serie + '', 100, 335 + row, {
      height: 20,
      width: DESCWIDTH,
      align: 'left',
      baseline: 'middle'
    });
    
    doc.text( 'id: ', 130, 335 + row, {
      height: 20,
      width: 30,
      align: 'center',
      baseline: 'middle'
    });
    
    doc.text(albaranes[j].id + '', 160, 335 + row, {
      height: 20,
      width: 30,
      align: 'left',
      baseline: 'middle'
    });

    doc.text('fecha: ', 190, 335 + row, {
      height: 20,
      width: 30,
      align: 'left',
      baseline: 'middle'
    });
    
    doc.text(albaranes[j].fecha, 220, 335 + row, {
      height: 20,
      width: 60,
      align: 'center',
      baseline: 'middle'
    });

    ++rowIndex;
    for (let i = 0; i < regs.length; i++) {
      
      const precio = (regs[i].precio_coste * (1 - regs[i].descuento / 100)).toFixed(3);
      const importe = (+precio * regs[i].cantidad).toFixed(3);
      const row = (rowIndex ? rowIndex : rowIndex + 1) % REGSXPAGES * VERTICAL_SPACE;

      doc.switchToPage( Math.floor(rowIndex / REGSXPAGES) );
      
      doc.text(regs[i].nombre_registro.trim(), 70, 335 + row, {
        height: 20,
        width: DESCWIDTH,
        align: 'left',
        baseline: 'middle'
      });
  
      doc.text(regs[i].cantidad + '', 270, 335 + row, {
        height: 20,
        width: NUMSWIDTH,
        align: 'center',
        baseline: 'middle'
      });
  
      doc.text(precio,
      367, 335 + row, {
        height: 20,
        width: NUMSWIDTH,
        align: 'center',
        baseline: 'middle'
      });
  
      doc.text( importe,
      465, 335 + row, {
        height: 20,
        width: NUMSWIDTH,
        align: 'center',
        baseline: 'middle'
      });
      ++rowIndex;
    }

  }

  doc.switchToPage(0);

}

export function drawFacturaVentaInfo(doc: PDFKit.PDFDocument, factura: FacturaVenta, serie: Serie) {
  doc.lineWidth(1);
  doc.fontSize(10);

  doc.rect(50, 220, 512, 25)
  .fillOpacity(0.8)
  .fill("#D3D3D3");

  doc.lineCap('butt')
  .rect(50, 220, 512, 50)
  .stroke();

  doc.moveTo(50, 245)
  .lineTo(562, 245)

  doc.moveTo(178, 220)
  .lineTo(178, 270)

  doc.moveTo(306, 220)
  .lineTo(306, 270)

  doc.moveTo(434, 220)
  .lineTo(434, 270)
  
  doc.lineCap('butt')
  .rect(50, 290, 512, 350)
  .stroke();
  doc.fillColor('#000000');
  doc.text('Fecha', 50, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(factura.fecha, 50, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Serie', 178, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(serie.nombre, 178, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('ID', 306, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(factura.id + '', 306, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })

}

export function drawTotalesFactura(doc: PDFKit.PDFDocument, albaranes: Array<AlbaranCompra | AlbaranVenta>) {

  let impuestos: UkObject = {};

  for(let i = 0; i < albaranes.length; i++ ){
    const imps = get_imp(albaranes[i].registros); 
    const keys = Object.keys(imps);;
    
    for (let key in keys) {
      if(!(keys[key] in impuestos)){
        impuestos[keys[key]] = 0;
      }
      impuestos[keys[key]] += imps[keys[key]];
    }

  }

  const imp_base = albaranes.reduce(function(sum: number, albaran: AlbaranCompra | AlbaranVenta): number {
    return sum + get_base(albaran.registros);
  }, 0).toFixed(2);

  const total = albaranes.reduce(function(sum: number, albaran: AlbaranCompra | AlbaranVenta): number {
    return sum + get_total(albaran.registros, albaran.descuento_general);
  }, 0).toFixed(2);

  doc.lineWidth(1);
  doc.fontSize(10);

  doc.rect(50, 660, 512, 25)
  .fillOpacity(0.8)
  .fill("#D3D3D3");

  doc.lineCap('butt')
  .rect(50, 660, 512, 50)
  .stroke();

  doc.strokeColor('#000');
  doc.moveTo(50, 685)
  .lineTo(562, 685);

  doc.moveTo(152, 660)
  .lineTo(152, 710);

  doc.moveTo(255, 660)
  .lineTo(255, 710);

  doc.moveTo(357, 660)
  .lineTo(357, 710);

  doc.moveTo(460, 660)
  .lineTo(460, 710);

  doc.stroke();
  doc.fillColor('#000000');
  doc.text('4%', 50, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(impuestos['4'] ? impuestos['4'].toFixed(2) : 0 + '', 50, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

  doc.text('10%', 152, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(impuestos['10'] ? impuestos['10'].toFixed(2) : 0 + '', 152, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  
  doc.text('21%', 255, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(impuestos['21'] ? impuestos['21'].toFixed(2) : 0 + '', 255, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

  doc.text('Base', 357, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(imp_base + '', 357, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

  doc.text('Total', 460, 672, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });
  doc.text(total + '', 460, 697, {
    height: 20,
    width: 102,
    align: 'center',
    baseline: 'middle'
  });

}


export function drawFacturaCompraInfo(doc: PDFKit.PDFDocument, factura: FacturaCompra, serie: Serie) {
  doc.lineWidth(1);
  doc.fontSize(10);

  doc.rect(50, 220, 512, 25)
  .fillOpacity(0.8)
  .fill("#D3D3D3");

  doc.lineCap('butt')
  .rect(50, 220, 512, 50)
  .stroke();

  doc.moveTo(50, 245)
  .lineTo(562, 245)

  doc.moveTo(178, 220)
  .lineTo(178, 270)

  doc.moveTo(306, 220)
  .lineTo(306, 270)

  doc.moveTo(434, 220)
  .lineTo(434, 270)
  
  doc.lineCap('butt')
  .rect(50, 290, 512, 350)
  .stroke();
  doc.fillColor('#000000');
  doc.text('Fecha', 50, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(factura.fecha, 50, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('Serie', 178, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(serie.nombre, 178, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text('ID', 306, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(factura.id + '', 306, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })

  doc.text('Numero Factura', 434, 232, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })
  doc.text(factura.id_factura_proveedor, 434, 257, {
    width: 128,
    height: 25,
    align: 'center',
    baseline: 'middle'
  })

}