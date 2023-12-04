usig.DatosUtiles = (function(b) {
    return usig.AjaxComponent.extend({
        
        init: function(c) {
            var d = b.extend({}, usig.DatosUtiles.defaults, c);
            this._normalizadorCaba = usig.NormalizadorDirecciones.init({
                aceptarCallesSinAlturas: false,
                callesEnMinusculas: true
            });
            this._super("DatosUtiles", usig.DatosUtiles.defaults.server, d);
        },
        onSuccess: function(c, d) {
            d(c);
        },
        validarMetodo: function(c) {
            if (c != undefined) {
                if (this.metodos.indexOf(c) >= 0) {
                    return c
                }
            } else {
                if (this.opts.metodo != undefined) {
                    return this.opts.metodo
                }
            }
            return undefined
        },
        getDatosUtiles: function(f, h, g, c) {
            if (!h.isInteger()) {
                throw ("altura tiene que ser un entero");
                return
            }
            var e = {
                calle: f,
                altura: h
            };
            this.mkRequest(e, this.onSuccess.createDelegate(this, [g], 1), this.onSuccess.createDelegate(this, [g], 1), this.opts.server+ "datos_utiles");
        },
        getDatosUtilesCoordenadas: function(f, h, g, c) {
            if (!h.isInteger()) {
                throw ("altura tiene que ser un entero");
                return
            }
            var e = {
                x: f,
                y: h
            };
            this.mkRequest(e, this.onSuccess.createDelegate(this, [g], 1), this.onSuccess.createDelegate(this, [g], 1), this.opts.server+ "datos_utiles");
        },
        getCoordLonlat: function(f, h, g, c) {
            
            var e = {
                x: f,
                y: h,
                output: "lonlat"
            };
            this.mkRequest(e, this.onSuccess.createDelegate(this, [g], 1), this.onSuccess.createDelegate(this, [g], 1), "//ws.usig.buenosaires.gob.ar/rest/convertir_coordenadas");
        }
    })
})(jQuery);
usig.DatosUtiles.defaults = {
    debug: false,
    server: "//ws.usig.buenosaires.gob.ar/"
};