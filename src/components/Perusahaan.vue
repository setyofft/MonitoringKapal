<template>
    <div id="content-page" class="content-page ml-0">
        <TopBar />
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-3">
                    <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                        <div class="iq-card-header d-flex justify-content-between">
                            <div class="iq-header-title">
                                <h4 class="card-title">Daftar Kapal</h4>
                            </div>
                            <span class="set-li" data-toggle="modal" data-target="#filter">
                                <a href="javascript:void(0)" data-toggle="modal" data-target="#filter" title="Filter Data">
                                    <i class="ri-filter-2-fill text-dark"></i>
                                </a>
                            </span>
                        </div>
                        <div class="iq-card-body pl-2 pr-0">
                            <div class="form-group ml-1 mr-2">
                                <input type="text" class="form-control" style="padding-right:30px"
                                    placeholder="Cari Nama Kapal" @keyup="cariNamaKapal" v-model="CnmKapal">
                                <a class="search-link mod" href="#"><i class="ri-search-line"></i></a>
                            </div>
                            <ul class="doctors-lists m-0 p-0 iq-email-sender-list" style="height: 56vh;">
                                <li class="d-flex mb-4 align-items-center pr-1"
                                    v-for="item in kapal" 
                                    :key="item.sn" 
                                    :class="{'active-li': item.id === selectedKapal}"
                                    @click="activeListKapal(item.id)"
                                >
                                    <div class="user-img img-fluid">
                                        <img :src="!item.timestamp || item.timestamp < item.tglNow ? 'images/shipOff.png' : 'images/shipOn.png' "
                                            alt="story-img" class="rounded-circle avatar-40" />
                                    </div>
                                    <a href="javascript:void(0)" @click="getSingleKapal(item)" class="iq-email-title">
                                        <div class="media-support-info ml-3">
                                            <h6>{{item.name}}</h6>
                                            <p class="mb-0 font-size-12">{{item.sn}}</p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="iq-card-footer p-3" style="border-top:1px solid #eee">
                            <div class="row">
                                <div class="col-lg-6 text-left">
                                    Total Data
                                </div>
                                <div class="col-lg-6 text-right">
                                    <b>{{kapal.length}}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9">
                    <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                        <div class="iq-card-body p-0">
                            <l-map class="map" style="height: 82vh; z-index: 0;" :zoom="zoom" :center="center">
                                <l-control-fullscreen />
                                <l-control position="topleft" v-if="kapalSingle.length || lineLatLon.length">
                                    <a href="javascript:void(0)" title="Back All Kapal" class="filtertrack" @click="getKapal(true)">
                                        <i class="ri-refresh-fill" style="font-size: 15px;"></i>
                                    </a>
                                </l-control>
                                <l-control position="topright" v-if="kapalSingle.length">
                                    <a href="javascript:void(0)" title="Filter" data-toggle="modal" data-target="#tracing" class="filtertrack">
                                        <i class="ri-filter-2-fill"></i>
                                    </a>
                                </l-control>
                                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                                <l-geo-json
                                    :geojson="geojson" 
                                    :options-style="stylegeojson" 
                                />
                                <l-rotated-marker v-if="kapalSingle.length" :lat-lng="kapalSingle" :icon="icon"
                                    :rotationAngle="heading">
                                    <l-popup>
                                        <table>
                                            <tr>
                                                <th width="50%">Nama Perusahaan</th>
                                                <th>:</th>
                                                <td>{{detailKapal.customer_name ? detailKapal.customer_name : '-'}}</td>
                                            </tr>
                                            <tr>
                                                <th width="50%">Nama Kapal</th>
                                                <th>:</th>
                                                <td>{{detailKapal.name ? detailKapal.name : '-'}}</td>
                                            </tr>
                                            <tr>
                                                <th width="50%">Vessel ID</th>
                                                <th>:</th>
                                                <th>{{detailKapal.id ? detailKapal.id : '-'}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">SN</th>
                                                <th>:</th>
                                                <th>{{detailKapal.sn ? detailKapal.sn : '-'}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Speed</th>
                                                <th>:</th>
                                                <td>{{detailKapal.speed ? detailKapal.speed : 0}}</td>
                                            </tr>
                                            <tr>
                                                <th width="50%">Heading</th>
                                                <th>:</th>
                                                <th>{{detailKapal.heading ? detailKapal.heading : '-'}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Latitude / Longitude</th>
                                                <th>:</th>
                                                <th>{{detailKapal.lat +' / '+ detailKapal.lon}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Atp Start / Atp End</th>
                                                <th>:</th>
                                                <th>{{formatISODate(detailKapal.atp_start) +' / '+ formatISODate(detailKapal.atp_end)}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Last Update</th>
                                                <th>:</th>
                                                <td :class="detailKapal.timestamp < detailKapal.tglNow ? 'text-danger' : '' ">
                                                    {{detailKapal.timestamp ? detailKapal.timestamp : '-'}}
                                                </td>
                                            </tr>
                                        </table>
                                        <hr>
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-sm btn-outline-primary" data-toggle="modal" data-target="#tracing">Tracing</button>
                                            <button class="btn btn-sm btn-outline-danger" 
                                                data-toggle="modal" data-target="#edit_kapal"
                                                @click="getKapalEdit(detailKapal.sn)"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </l-popup>
                                </l-rotated-marker>
                                <!-- all marker -->
                                <l-rotated-marker v-for="data in markerKapal" :key="data.sn"
                                    :lat-lng="[parseFloat(data.lat), parseFloat(data.lon)]"
                                    :icon="data.speed ? iconOn: iconOff"
                                    :rotationAngle="data.heading ? parseInt(data.heading) : 0">
                                    <l-popup>
                                        <table>
                                            <tr>
                                                <th width="50%">Nama Perusahaan</th>
                                                <th>:</th>
                                                <td>{{data.customer_name ? data.customer_name : '-'}}</td>
                                            </tr>
                                            <tr>
                                                <th width="50%">Nama Kapal</th>
                                                <th>:</th>
                                                <td>{{data.name ? data.name : '-'}}</td>
                                            </tr>
                                            <tr>
                                                <th width="50%">Vessel ID</th>
                                                <th>:</th>
                                                <th>{{data.id ? data.id : '-'}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">SN</th>
                                                <th>:</th>
                                                <th>{{data.sn ? data.sn : '-'}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Speed</th>
                                                <th>:</th>
                                                <td>{{data.speed ? data.speed : 0}}</td>
                                            </tr>
                                            <tr>
                                                <th width="50%">Heading</th>
                                                <th>:</th>
                                                <th>{{data.heading ? data.heading : '-'}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Latitude / Longitude</th>
                                                <th>:</th>
                                                <th>{{data.lat +' / '+ data.lon}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Atp Start / Atp End</th>
                                                <th>:</th>
                                                <th>{{formatISODate(data.atp_start) +' / '+ formatISODate(data.atp_end)}}</th>
                                            </tr>
                                            <tr>
                                                <th width="50%">Last Update</th>
                                                <th>:</th>
                                                <td :class="data.timestamp < data.tglNow ? 'text-danger' : '' ">
                                                    {{data.timestamp ? data.timestamp : '-'}}
                                                </td>
                                            </tr>
                                        </table>
                                        <hr>
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-sm btn-outline-primary" data-toggle="modal" 
                                                data-target="#tracing" @click="getTanggal(data.sn)"
                                            >
                                                Tracing
                                            </button>
                                            <button class="btn btn-sm btn-outline-danger" 
                                                data-toggle="modal" data-target="#edit_kapal"
                                                @click="getKapalEdit(data.sn)"
                                            >  
                                                Edit
                                            </button>
                                        </div>
                                    </l-popup>
                                </l-rotated-marker>

                                <!-- rute marker -->
                                <l-rotated-marker v-for="data in markerRute" :key="data.id"
                                    :lat-lng="[parseFloat(data.Latitude), parseFloat(data.Longitude)]"
                                    :icon="data.kecepatan ? iconOn: iconOff"
                                    :rotationAngle="data.Direction ? parseInt(data.Direction) : 0">

                                </l-rotated-marker>
                                <l-polyline v-if="lineLatLon" :lat-lngs="lineLatLon" :color="color"></l-polyline>
                            </l-map>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- filter modal -->
        <div class="modal fade" id="filter" tabindex="-1" aria-labelledby="filter" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Filter Data Kapal</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check">
                            <input v-model="filter" class="form-check-input" type="radio" id="default" value="default" checked>
                            <label class="form-check-label" for="default">
                                Order Default
                            </label>
                        </div>
                        <div class="form-check">
                            <input v-model="filter" class="form-check-input" type="radio" id="bynmkapal" value="bynmkapal">
                            <label class="form-check-label" for="bynmkapal">
                                Order By Nama Kapal
                            </label>
                        </div>
                        <div class="form-check">
                            <input v-model="filter" class="form-check-input" type="radio" id="bylastposisi" value="bylastposisi">
                            <label class="form-check-label" for="bylastposisi">
                                Order By Last Position
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="filterKapal()" data-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- tracing modal -->
        <div class="modal fade" id="tracing" tabindex="-1" aria-labelledby="tracing" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Filter Data Tracking</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check">
                            <input v-model="traceOption" class="form-check-input" type="radio" value="last10day" checked>
                            <label class="form-check-label" for="default">
                                Berapa Titik Lokasi Terakhir
                            </label>
                            <input type="number" class="form-control" style="width: 47%;" v-model="last10day">
                        </div>
                        <div class="form-check">
                            <input v-model="traceOption" class="form-check-input" type="radio" value="lasyhowday" checked>
                            <label class="form-check-label" for="default">
                                Berapa Hari Terakhir ?
                            </label>
                            <input type="number" class="form-control" style="width: 47%;" placeholder="10" v-model="lasyhowday">
                        </div>
                        <div class="form-check">
                            <input v-model="traceOption" class="form-check-input" type="radio" value="filterdate" checked>
                            <label class="form-check-label" for="default">
                                Filter Antara Tanggal
                            </label>
                            <div class="d-flex justify-content-between align-items-center">
                                <input type="date" class="form-control" style="width: 47%;" v-model="tgldari">
                                <span class="text-dark">S/D</span>
                                <input type="date" class="form-control" style="width: 47%;" v-model="tglsampai">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="getRute()" data-dismiss="modal">Search</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- edit kapal modal -->
        <div class="modal fade" id="edit_kapal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Kapal</h5>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label>Nama Customer</label>
                                    <!-- <multiselect v-model="editKapal.customer" placeholder="Pilih customer"
                                        :options="listPerusahaan" :allow-empty="true" :close-on-select="true"
                                        deselect-label="Klik untuk batal memilih" select-label="Klik untuk memilih" selected-label="Terpilih"
                                        track-by="id" label="customer_name"
                                    ></multiselect>
                                    <pre class="language-json"><code>{{ editKapal.customer }}</code></pre> -->
                                    <select v-model="editKapal.customer" class="form-control">
                                        <option value="" disabled>Pilih nama customer</option>
                                        <option v-for="item in listPerusahaan" :key="item.id" :value="item.id">{{ item.customer_name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Vessel ID</label>
                                    <input v-model="editKapal.id" autocomplete="false" type="text" placeholder="Masukkan vessel ID" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>IMEI</label>
                                    <input v-model="editKapal.imei" autocomplete="false" type="text" placeholder="Masukkan nomor IMEI" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>Categori</label>
                                    <!-- <multiselect v-model="editKapal.category_id" placeholder="Pilih kategori customer" 
                                        :options="listTipeCustomer" :allow-empty="true"
                                        track-by="id" label="name"
                                    ></multiselect> -->
                                    <select v-model="editKapal.category_id" class="form-control">
                                        <option value="" disabled>Pilih categori customer</option>
                                        <option v-for="item in listTipeCustomer" :key="item.id" :value="item.id">{{ item.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Tipe Kapal</label>
                                    <!-- <multiselect v-model="editKapal.type_id" placeholder="Pilih tipe Kapal" 
                                        :options="listTipeKapal" :allow-empty="true"
                                        track-by="id" label="name"
                                    ></multiselect> -->
                                    <select v-model="editKapal.type_id" class="form-control">
                                        <option value="" disabled>Pilih tipe kapal</option>
                                        <option v-for="item in listTipeKapal" :key="item.id" :value="item.id">{{ item.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label>ATP Start</label>
                                    <input v-model="editKapal.atp_start" autocomplete="false" type="date" placeholder="mm/dd/yyyy" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>ATP End</label>
                                    <input v-model="editKapal.atp_end" autocomplete="false" type="date" placeholder="mm/dd/yyyy" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>Device ID/SN</label>
                                    <input autocomplete="false" type="text" class="form-control" v-model="editKapal.sn" disabled>
                                </div>
                                <div class="form-group">
                                    <label>Nama Kapal</label>
                                    <input autocomplete="false" type="text" placeholder="Masukkan nama kapal" class="form-control" v-model="editKapal.name">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="updateKapal(editKapal.sn)">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from './include/TopBar.vue'
import {
    LMap,
    LTileLayer,
    LGeoJson,
    LPopup,
    LPolyline,
    LControl
} from 'vue2-leaflet'
import L from 'leaflet';
import mapjson from '../assets/seazone.json'
import axios from 'axios';

L.Icon.Default.imagePath = '/';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    name: "Perusahaan",
    components: {
        TopBar,
        LMap,
        LTileLayer,
        LGeoJson,
        LPopup,
        LPolyline,
        LControl
    },
    directives: {},
    data() {
        return {
            idakun: null,
            getUrl: null,
            filter: 'default',
            kapal: [],
            selectedKapal: null,
            markerKapal: [],
            markerRute: [],
            CnmKapal: null,
            tglHistori: null,
            deviceId: null,
            lineLatLon: [],
            color: 'gray',

            // multiselect options
            listPerusahaan: [],
            listTipeCustomer: [],
            listTipeKapal: [],

            // form tracing kapal
            traceOption: null,
            tgldari: null,
            tglsampai: null,
            last10day: null,
            lasyhowday: null,

            // form edit kapal
            editKapal: {},
            customer: [],

            //data detail kapal
            detailKapal: {},

            icon: null,
            heading: null,
            kapalSingle: [],

            //data maps
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a target="_blank" href="https://kapalpintar.co.id">KapalPintar</a> contributors<span class="mr-2"></span>',
            zoom: 5,
            geojson: null,
            stylegeojson: {
                weight: 2,
                color: 'grey',
                fillColor: '#ccc',
                fillOpacity: 0,
                dashArray: '3, 10',
            },
            center: [-5.3121961, 116.0877759],
            iconOn: L.icon({
                iconUrl: '/images/iconon.png',
                iconSize: [12, 12],
            }),
            iconOff: L.icon({
                iconUrl: '/images/iconoff.png',
                iconSize: [12, 12],
            }),
        };
    },
    beforeCreate: function () {
        if (this.$session.exists()) {
            this.$router.push("/perusahaan");
        } else {
            this.$router.push("/");
        }
    },
    created() {
        this.getJsonMap()
        this.getKapal()
        this.getLists()
    },
    mounted() {
        this.idakun = this.$session.get("level");
    },
    methods: {
        // created initiate
        async getJsonMap() {
            this.showloadingBar()
            try {
                this.geojson = await mapjson;
            } catch (error) {
                console.log(error);
            }
        },
        async getKapal(refresh_state = false) {
            try {
                if (this.$session.get('level') === 'root') {
                    this.getUrl = 'https://track.kapalpintar.co.id/api/kapal_all';
                } else {
                    this.getUrl = `https://track.kapalpintar.co.id/api/kapal/${this.$session.get('id')}`;
                }
                console.log(refresh_state);

                if(refresh_state) {
                    // declare default center
                    this.center = [-5.3121961, 116.0877759];

                    // normalize everything - provide default data
                    this.kapalSingle = [];
                    this.markerRute = [];
                    this.lineLatLon = [];
                    this.icon = null;
                    this.heading = null;
                    this.tglHistori = null;
                    this.dari = null;
                    this.sampai = null;
                    this.deviceId = null;
                    this.CnmKapal = null;
                    this.detailKapal = {};
                }

                const response = await axios.get(this.getUrl);
                this.kapal = response.data;
                this.markerKapal = response.data;

                this.closeloadingBar();
            } catch (error) {
                console.log(error);
            }
        },
        async getLists() {
            try {
                const data_perusahaan = await axios.get('https://track.kapalpintar.co.id/api/data_perusahaan');
                const kategori_customer = await axios.get('https://track.kapalpintar.co.id/api/kategori_customers');
                const tipe_kapal = await axios.get('https://track.kapalpintar.co.id/api/tipe_kapal');

                this.listPerusahaan = data_perusahaan.data.results;
                this.listTipeCustomer = kategori_customer.data.results;
                this.listTipeKapal = tipe_kapal.data.results;
            } catch(err) {
                console.log(err);
            }
        },

        async filterKapal() {
            this.showloadingBar()
            try {
                if (this.$session.get('level') === 'root') {
                    if(this.filter == 'default'){
                        await this.getKapal();
                        return;
                    }else if(this.filter == 'bynmkapal'){
                        this.getUrl = 'https://track.kapalpintar.co.id/api/kapal_all_bynm';
                    }else if(this.filter == 'bylastposisi'){
                        this.getUrl = 'https://track.kapalpintar.co.id/api/kapal_all_lastposisi';
                    } else {
                        return;
                    }
                } else {
                    if(this.filter == 'default'){
                        await this.getKapal();
                        return;
                    }else if(this.filter == 'bynmkapal'){
                        this.getUrl = `https://track.kapalpintar.co.id/api/kapal_bynama/${this.$session.get('id')}`;
                    }else if(this.filter == 'bylastposisi'){
                        this.getUrl = `https://track.kapalpintar.co.id/api/kapal_lastposisi/${this.$session.get('id')}`;
                    } else {
                        return;
                    }
                }
                const response = await axios.get(this.getUrl);
                this.kapal = response.data;
                this.marekerKapal = response.data;

                this.closeloadingBar();
            } catch (error) {
                console.log(error);
            }
        },
        getSingleKapal(item) {
            try {
                this.markerKapal = [];
                this.markerRute = [];
                this.lineLatLon = [];
                this.tglHistori = null;
                this.kapalSingle = [parseFloat(item.lat), parseFloat(item.lon)];
                this.center = [parseFloat(item.lat), parseFloat(item.lon)];
                this.icon = item.speed ? this.iconOn : this.iconOff;
                this.heading = item.heading ? parseInt(item.heading) : 0;
                //popup
                this.detailKapal = item;

                this.getTanggal(item.sn);
            } catch (error) {
                console.log(error);
            }
        },
        async cariNamaKapal() {
            try {
                this.kapalSingle = [];
                if (this.$session.get('level') === 'root') {
                    this.getUrl = 'https://track.kapalpintar.co.id/api/kapal/search_all';
                } else {
                    this.getUrl = `https://track.kapalpintar.co.id/api/kapal/search/${this.$session.get('id')}`;
                }
                const response = await axios.post(this.getUrl, {
                    search: this.CnmKapal
                });
                this.kapal = response.data;
                this.markerKapal = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getTanggal(sn) {
            this.showloadingBar();
            try {
                const response = await axios.get(`https://track.kapalpintar.co.id/api/histori_tgl/${sn}`);
                this.tglHistori = response.data;
                this.tgldari = response.data[0].tanggal;
                this.tglsampai = new Date().toISOString().slice(0, 10);
                this.deviceId = sn;
                this.closeloadingBar();
            } catch (error) {
                this.closeloadingBar();
                console.log(error);
            }
        },
        async getRute() {
            this.showloadingBar();
            try {
                let data = {dari: this.tgldari, sampai: this.tglsampai, jumltitik: 10, tipefilter: null};

                if(this.traceOption == 'last10day') {
                    data.jmltitik = this.last10day;
                    data.tipefilter = this.traceOption;
                } else if(this.traceOption == 'lasyhowday') {
                    let day = parseInt(this.lasyhowday) ? parseInt(this.lasyhowday) : 10;
                    console.log(day)
                    data.dari = new Date(new Date().getTime() - (day * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
                } else if(this.traceOption == 'filterdate') {
                    data.dari = this.tgldari;
                    data.sampai = this.tglsampai;
                    data.tipefilter = this.traceOption;
                } else {
                    this.closeloadingBar();
                    this.$swal.fire({
                        title: 'Pilih Filter',
                        text: 'Silahkan pilih filter terlebih dahulu',
                        type: 'warning',
                        confirmButtonText: 'OK'
                    });

                    return;
                }

                const response = await axios.post(`https://track.kapalpintar.co.id/api/histori_kapal/${this.deviceId}`, data);
                this.kapalSingle = [];
                this.markerRute = response.data['histori'];
                this.lineLatLon = response.data['polyline'];
                this.closeloadingBar()
            } catch (error) {
                console.log(error);
            }
        },

        // edit kapal
        async getKapalEdit(sn) {
            try {
                this.showloadingBar();

                const kapal_by_sn = await axios.get(`https://track.kapalpintar.co.id/api/kapal_sn/${sn}`);
                // reconfig editKapal properties
                this.editKapal = kapal_by_sn.data[0];
                this.editKapal.tipeForm = 'Edit';
                if(this.editKapal.atp_start) this.editKapal.atp_start = this.formatISODate(this.editKapal.atp_start);
                if(this.editKapal.atp_end) this.editKapal.atp_end = this.formatISODate(this.editKapal.atp_end);

                const tipe_kapal = await axios.get(`https://track.kapalpintar.co.id/api/tipe_kapal/${this.editKapal.type_id}`);
                this.tipeKapal = tipe_kapal.data.results[0];
                const customer = await axios.get(`https://track.kapalpintar.co.id/api/perusahaan/${this.editKapal.customer}`);
                this.customer = customer.data.results[0];

                this.closeloadingBar();
            } catch(err) {
                this.closeloadingBar()
                console.log(err)
            }
        },
        async updateKapal(sn) {
            if(!sn) {
                this.$swal.fire({
                    title: 'Kapal tidak ditemukan',
                    text: 'Silahkan coba lagi',
                    type: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }

            try {
                this.showloadingBar();

                this.editKapal.id_customer = this.editKapal.customer;
                await axios.put(`https://track.kapalpintar.co.id/api/updatepemilikkapal/${sn}`, this.editKapal);

                this.CnmKapal = this.editKapal.name;
                await this.cariNamaKapal();
                this.$swal.fire({
                    title: 'Berhasil',
                    text: 'Data berhasil diubah',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
            } catch(err) {
                this.closeloadingBar();
                console.log(err);
            }
        },

        showloadingBar() {
            this.$swal.fire({
                html: "<img src='images/loading-bar.gif' style='width: 50px;'/><p>Loading...</p>",
                showConfirmButton: false,
            });
        },
        closeloadingBar() {
            this.$swal.fire({
                showConfirmButton: false,
            }).close();
        },
        activeListKapal(id) {
            this.selectedKapal = id ? id : null;
        },
        formatISODate(date) {
            let d = new Date(date);

            return d.toISOString().split('T')[0];
        }
    },
};
</script>

<style scoped>
li .iq-email-title{
    width: 100%;
}
.doctors-lists li{
    padding-bottom: 5px;
    padding-top: 5px;
}
.doctors-lists li:hover{
    background: #ebf4f5;
    border-radius: 50px;
}
.active-li {
    background: #ceebee;
    border-radius: 50px;
}
.map{
    border-radius: 25px;
}
.mod{
    position: absolute;
    right: 30px;
    top: 12.5%;
    font-size: 15pt;
}
.popFilter{
    position: absolute;
    z-index: 9999;
    background: white;
    border-radius: 15px;
    width: 50%;
    margin-top: 10px;
    margin-left: 25%;
    padding: 5px;
    -webkit-box-shadow: 0px 0px 25px 0px rgb(45 69 95 / 10%);
    -moz-box-shadow: 0px 0px 25px 0px rgba(45, 69, 95, 0.1);
    box-shadow: 0px 0px 25px 0px rgb(45 69 95 / 10%);
}
.set-li {
    border-left: 1px solid grey;
    padding-left: 10px;
    border-left-style: dashed;
}
.filtertrack {
    padding: 10px;
    color: #000;
    background: #fff;
    border: 2px solid #89a9b2;
    border-radius: 3px;
}
</style>
