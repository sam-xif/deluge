/*
Script: execute.js
    The client-side javascript code for the Execute plugin.

Copyright:
    (C) Damien Churchill 2009-2010 <damoxc@gmail.com>
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3, or (at your option)
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, write to:
        The Free Software Foundation, Inc.,
        51 Franklin Street, Fifth Floor
        Boston, MA  02110-1301, USA.

    In addition, as a special exception, the copyright holders give
    permission to link the code of portions of this program with the OpenSSL
    library.
    You must obey the GNU General Public License in all respects for all of
    the code used other than OpenSSL. If you modify file(s) with this
    exception, you may extend this exception to your version of the file(s),
    but you are not obligated to do so. If you do not wish to do so, delete
    this exception statement from your version. If you delete this exception
    statement from all source files in the program, then also delete it here.
*/
Ext.ns('Deluge.ux.preferences');

/**
 * @class Deluge.ux.preferences.ExecutePage
 * @extends Ext.Panel
 */
Deluge.ux.preferences.ExecutePage = Ext.extend(Ext.Panel, {

	title: _('Execute'),
	layout: 'fit',
	border: false,
	    
	initComponent: function() {
	    Deluge.ux.preferences.ExecutePage.superclass.initComponent.call(this);
		var event_map = this.event_map = {
			'complete': _('Torrent Complete'),
			'added': _('Torrent Added')
		}

		this.list = new Ext.list.ListView({
			store: new Ext.data.SimpleStore({
				fields: [
					{name: 'event', mapping: 1},
					{name: 'name', mapping: 2}
				],
				id: 0
			}),
			columns: [{
				width: .3,
				header: _('Event'),
				sortable: true,
				dataIndex: 'event',
				tpl: new Ext.XTemplate('{[this.getEvent(values.event)]}', {
					getEvent: function(e) {
						return (event_map[e]) ? event_map[e] : e;
					}
				})
			}, {
				id: 'name',
				header: _('Command'),
				sortable: true,
				dataIndex: 'name'
			}],
			singleSelect: true,
			autoExpandColumn: 'name'
		});

		this.panel = this.add({
			items: [this.list]
		});
		
		deluge.preferences.on('show', this.onPreferencesShow, this);
	},

	onPreferencesShow: function() {
	    deluge.client.execute.get_commands({
			success: function(commands) {
				this.list.getStore().loadData(commands);
			},
			scope: this
		});
	}
});

Deluge.plugins.ExecutePlugin = Ext.extend(Deluge.Plugin, {

	name: 'Execute',
	
	onDisable: function() {
	    deluge.preferences.removePage(this.prefsPage);
	},
	
	onEnable: function() {
		this.prefsPage = deluge.preferences.addPage(new Deluge.ux.preferences.ExecutePage());
	}
});
Deluge.registerPlugin('Execute', Deluge.plugins.ExecutePlugin);
