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
                            <div class="col-md-12 popFilter pl-3 pr-3 pt-3" v-if="tglHistori">
                                <h6 class="text-center mb-3" style="font-weight: 600;">{{kapalterpilih}}</h6>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Tanggal Dari</label>
                                            <select v-model="tgldari" required class="form-control form-control-sm">
                                                <option selected>Pilih Tanggal Dari</option>
                                                <option v-for="data in tglHistori" :key="data.id" :value="data.tanggal">
                                                    {{data.tanggal}}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Tanggal Sampai</label>
                                            <select v-model="tglsampai" @change="getRute"
                                                class="form-control form-control-sm">
                                                <option selected>Pilih Tanggal Sampai</option>
                                                <option v-for="data in tglHistori" :key="data.id" :value="data.tanggal">
                                                    {{data.tanggal}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <l-map class="map" style="height: 82vh; z-index: 0;" :zoom="zoom" :center="center">
                                <l-control-fullscreen />
                                <l-tile-layer :url="url"></l-tile-layer>
                                <l-geo-json
                                    :geojson="geojson" 
                                    :options-style="stylegeojson" 
                                />
                                <l-rotated-marker v-if="kapalSingle.length" :lat-lng="kapalSingle" :icon="icon"
                                    :rotationAngle="heading">
                                    <l-popup>
                                        <table>
                                            <tr>
                                                <th>Nama Perusahaan</th>
                                                <th>:</th>
                                                <td>{{Knmperusahaan}}</td>
                                            </tr>
                                            <tr>
                                                <th>Nama Kapal</th>
                                                <th>:</th>
                                                <td>{{Knmkapal}}</td>
                                            </tr>
                                            <tr>
                                                <th>Speed</th>
                                                <th>:</th>
                                                <td>{{Kspeed}}</td>
                                            </tr>
                                            <tr>
                                                <th>Imei</th>
                                                <th>:</th>
                                                <td>{{Kimei}}</td>
                                            </tr>
                                            <tr>
                                                <th>Atp Start / Atp End</th>
                                                <th>:</th>
                                                <td>{{Katpstart}} / {{Katpend}}</td>
                                            </tr>
                                            <tr>
                                                <th>Last Update</th>
                                                <th>:</th>
                                                <td :class="Klastupdate < KtglNow ? 'text-danger' : '' ">
                                                    {{Klastupdate}}
                                                </td>
                                            </tr>
                                        </table>
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
                                            <button class="btn btn-sm btn-outline-primary" data-toggle="modal" data-target="#tracing">Tracing</button>
                                            <button class="btn btn-sm btn-outline-danger" @click="getHistory(data.sn)">Edit</button>
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
                            <input v-model="traceOption" class="form-check-input" type="radio" value="filterhowday" checked>
                            <label class="form-check-label" for="default">
                                Berapa Hari Terakhir ?
                            </label>
                            <input type="number" class="form-control" style="width: 47%;" placeholder="10" v-model="filterhowday">
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
                        <button type="button" class="btn btn-primary" @click="traceKapal()" data-dismiss="modal">Search</button>
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
    LPolyline
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
        LPolyline
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
            traceOption: null,
            tgldari: null,
            tglsampai: null,
            deviceId: null,
            lineLatLon: [],
            color: 'gray',
            kapalterpilih: null,

            //data detail kapal
            Knmperusahaan: null,
            Knmkapal: null,
            Kspeed: null,
            Kimei: null,
            Katpend: null,
            Katpstart: null,
            Klastupdate: null,
            KtglNow: null,

            icon: null,
            heading: null,
            kapalSingle: [],

            //data maps
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
    },
    mounted() {
        this.idakun = this.$session.get("level");
    },
    methods: {
        async getJsonMap() {
            this.showloadingBar()
            try {
                this.geojson = await mapjson;
            } catch (error) {
                console.log(error);
            }
        },
        async getKapal() {
            try {
                if (this.$session.get('level') === 'root') {
                    this.getUrl = 'https://track.kapalpintar.co.id/api/kapal_all';
                } else {
                    this.getUrl = `https://track.kapalpintar.co.id/api/kapal/${this.$session.get('id')}`;
                }
                const response = await axios.get(this.getUrl);
                this.kapal = response.data;
                this.markerKapal = response.data;

                this.closeloadingBar();
            } catch (error) {
                console.log(error);
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
                this.kapalterpilih = item.name;
                this.kapalSingle = [parseFloat(item.lat), parseFloat(item.lon)];
                this.center = [parseFloat(item.lat), parseFloat(item.lon)];
                this.icon = item.speed ? this.iconOn : this.iconOff;
                this.heading = item.heading ? parseInt(item.heading) : 0;
                //popup
                this.Knmperusahaan = item.customer_name ? item.customer_name : '-';
                this.Knmkapal = item.name;
                this.Kspeed = item.speed ? item.speed : 0;
                this.Kimei = item.imei ? item.imei : '-';
                this.Katpstart = item.atp_start ? item.atp_start : 0;
                this.Katpend = item.atp_end ? item.atp_end : 0;
                this.Klastupdate = item.timestamp;
                this.KtglNow = item.tglNow;

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
                this.deviceId = sn;
                this.closeloadingBar();
            } catch (error) {
                console.log(error);
            }
        },
        async getRute() {
            this.showloadingBar();
            try {
                const response = await axios.post(`https://track.kapalpintar.co.id/api/histori_kapal/${this.deviceId}`, {
                    dari: this.tgldari,
                    sampai: this.tglsampai
                });
                this.kapalSingle = [];
                this.markerRute = response.data['histori'];
                this.lineLatLon = response.data['polyline'];
                this.closeloadingBar()
            } catch (error) {
                console.log(error);
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

            return d.toLocaleDateString('id-ID').replaceAll('/', '-');
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
</style>
