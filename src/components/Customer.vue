<template>
    <div id="content-page" class="content-page ml-0">
        <TopBar />
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-3">
                    <div class="iq-card iq-card-stretch">
                        <div class="iq-card-header d-flex justify-content-between">
                            <div class="iq-header-title">
                                <h4 class="card-title">Customers</h4>
                            </div>
                            <button class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#tambah">
                                Tambah
                            </button>
                        </div>
                        <div class="iq-card-body pl-2 pr-0">
                            <div class="form-group ml-1 mr-2">
                                <input type="text" class="form-control" style="padding-right:30px"
                                    placeholder="Cari Nama Customer" v-model="CnmCustomer">
                                <a class="search-link mod" href="#"><i class="ri-search-line"></i></a>
                            </div>
                            <ul class="doctors-lists m-0 p-0 iq-email-sender-list" style="height: 56vh;">
                                <li class="d-flex mb-4 align-items-center pr-1"
                                    v-for="item in customer" 
                                    :key="item.id" 
                                    :class="{'active-li': item.id === selectedCustomer}"
                                    @click="activeListCustomer(item.id)"
                                >
                                    <div class="user-img img-fluid">
                                        <img src="images/customer.png" alt="customer icon" class="rounded-circle avatar-40" />
                                    </div>
                                    <a href="javascript:void(0)" class="iq-email-title">
                                        <div class="media-support-info ml-3">
                                            <h6>{{item.customer_name ? item.customer_name : '-'}}</h6>
                                            <p class="mb-0 font-size-12">{{item.npwp ? item.npwp : '-'}}</p>
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
                                    <b>{{customer.length}}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9">
                    <div class="mt-5 text-center" width="100%">
                        <h5 class="mb-5" style="margin-top: 10%; color: #ffc727">
                            Data customer belum dipilih !
                        </h5>
                        <img src="images/5667051.png" class="mt-2">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from './include/TopBar.vue';
import axios from 'axios';

export default {
    name: "Customer",
    components: {
        TopBar
    },
    directives: {},
    data() {
        return {
            customer: [],
            CnmCustomer: null,
            selectedCustomer: null,
        };
    },
    beforeCreate: function () {
        if(this.$session.exists()) {
            this.$router.push("/customers");
        } else {
            this.$router.push("/");
        }
    },
    created() {
        this.getCustomer();
    },
    mounted() {
        this.idakun = this.$session.get("level");
    },
    methods: {
        async getCustomer() {
            try {
                const response = await axios.get(`https://track.kapalpintar.co.id/api/data_perusahaan`);
                this.customer = response.data.results;
            } catch (error) {
                console.log(error);
            }
        },
        activeListCustomer(id) {
            this.selectedCustomer = id ? id : null;
        }
    }
}
</script>

<style scoped>
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
.mod{
    position: absolute;
    right: 30px;
    top: 12.5%;
    font-size: 15pt;
}
</style>