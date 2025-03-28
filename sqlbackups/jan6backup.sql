PGDMP                       }            dbwji5kevgju1o    16.5    16.3                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16953    dbwji5kevgju1o    DATABASE     p   CREATE DATABASE dbwji5kevgju1o WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE dbwji5kevgju1o;
                sjvrdhzbxwg6m    false                       0    0    DATABASE dbwji5kevgju1o    ACL     x   REVOKE CONNECT,TEMPORARY ON DATABASE dbwji5kevgju1o FROM PUBLIC;
GRANT ALL ON DATABASE dbwji5kevgju1o TO u3l6jydkaavcw;
                   sjvrdhzbxwg6m    false    3354            �            1259    17159    deals    TABLE     �  CREATE TABLE public.deals (
    deal_id integer NOT NULL,
    restaurant_id integer,
    title character varying(255),
    description text,
    price character varying(50),
    day_of_week character varying(10),
    category character varying(100),
    second_category character varying(100),
    start_time time without time zone,
    end_time time without time zone,
    is_approved boolean DEFAULT false,
    is_promoted boolean DEFAULT false,
    promoted_until timestamp without time zone,
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    price_per_wing numeric,
    deal_type character varying(50) DEFAULT 'flat'::character varying,
    category_details text,
    price_type character varying(20) DEFAULT 'flat'::character varying,
    flat_price numeric(10,2),
    percentage_discount numeric(5,2)
);
    DROP TABLE public.deals;
       public         heap    u3l6jydkaavcw    false            �            1259    17158    deals_deal_id_seq    SEQUENCE     �   CREATE SEQUENCE public.deals_deal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.deals_deal_id_seq;
       public          u3l6jydkaavcw    false    220                       0    0    deals_deal_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.deals_deal_id_seq OWNED BY public.deals.deal_id;
          public          u3l6jydkaavcw    false    219            z           2604    17162    deals deal_id    DEFAULT     n   ALTER TABLE ONLY public.deals ALTER COLUMN deal_id SET DEFAULT nextval('public.deals_deal_id_seq'::regclass);
 <   ALTER TABLE public.deals ALTER COLUMN deal_id DROP DEFAULT;
       public          u3l6jydkaavcw    false    220    219    220                      0    17159    deals 
   TABLE DATA           8  COPY public.deals (deal_id, restaurant_id, title, description, price, day_of_week, category, second_category, start_time, end_time, is_approved, is_promoted, promoted_until, created_by, created_at, updated_at, price_per_wing, deal_type, category_details, price_type, flat_price, percentage_discount) FROM stdin;
    public          u3l6jydkaavcw    false    220   [                  0    0    deals_deal_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.deals_deal_id_seq', 162, true);
          public          u3l6jydkaavcw    false    219            �           2606    17169    deals deals_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_pkey PRIMARY KEY (deal_id);
 :   ALTER TABLE ONLY public.deals DROP CONSTRAINT deals_pkey;
       public            u3l6jydkaavcw    false    220            �           2606    17170    deals deals_restaurant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(restaurant_id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.deals DROP CONSTRAINT deals_restaurant_id_fkey;
       public          u3l6jydkaavcw    false    220                  x��][s�Hv~���v�2���H�/z���e�;�ʵS[5/�YXS��v�}O�-U�<��/�O�9�l�-4HU��T�X ��>t�>�;��2�U.{]K�lv����rI^�U���T��v�v��!߹��ڪ�_������x�)�/!���sir�(�2��\�s*`H:��7ˢǟ�e{]�}���3�p#2�>ӹs�UӴ��z�?'���XTEM�$o��la�/�EU������2�^�nU�O�,ی�sA�)�@�S��rm��|�q������������q`�������]]e�e�s���o�f�͘e����X.7�YƧa� ��Y��\~�I�>�����9�PK�8�YΘ��N@1	�mS��O	f]�ʙ2ZMK�ˬ�:����[R��궺�2l���Y���ژ2�k���^Y�Ef�˻~��US�m%�Usw��t�c��	f`� 47FX�&��-0��)�Z�E�I���л⺙�;�D�̕q��I8zGg��υ_������5JՈjx{*��VT(qR�i�R[T*���X�����&o�
�t͆�웏%n��G2�F��ZZ�q�5�l �s���)�|��Ⱦ��oڞ\��]��#/��_�9����?��dP�j���,�LH
Z����6�c�1˾oq_�!���uo��Q��>B�|V�4�)�4�ޝ�* ?�ʠ^d���x�D�TmyU,����ۦP�+�� R���Sp������JMkh0>[�"rW1��QZ�l#Xj%�V�Zy�9�w�" Ҝ�U!9Gc����QfU�Y��b7�1��q�"eά氀��.�3C�\�q`f����f�vdi�R�#�@QI����->
,KԌ-Pğꪩa���\���Ѓ��äA�s!�e�vK������W�Wk���t4M ��$���!I�L�+ N������)Ȼ�/j:rӴ�L�N01�y]<�g�p��,?<�����iK��ܔ���IS�ҬZҕ��/�~Wp�FIW,K㿮�~���_���n˛��n�N���3��zN�� <�|6�Y"7msG#_�%}�o��/��\=�������b�N@��VY�We���-`=��&���'r#� #\RnǇ���;��'�_W=\=�E���[�2<�G�	 ߯�N}��j�Oݳ7 ^ޞ�2ۿÒ*\R��h�8��	C��i���(͞�L|u���*����i�QC�	��˴���rƤ�W����%5�M?��<����e9,��p�������K�%y�*�(O�&6q����9Ν�<����K ��a+ 7 ,d��k�襚��n����̢y [re?��� ͪ���2{Y�X�N�����74/�N��y���J
3�nK��+�+A֘���!eq}K�m��]�o+P1�f�<����ht�$�E���[�l��H�̳����?b�c���c��WE�莘P��TE�qp�1��G7���,z���E��q�AU��ѩ�5}�Q-c�'@10*��	��'pл��Y?{#��#:w�S��@�����3�� ���mq?���1�n�9����4�ohZ�δ6At��P���#zr�T��:����M��,�����1N��3�sb��rǨN�=�h���v�� i}A�= ;|.��������
��s���� .�h����jё��V���iŁl;�|�9b��@b����n� \�a�?j4�.���4�-�4� l��d�r�M���95�q�'s�)s��|���a\�����)�r��p��^	�F��,�\Y�ֆ� ����p����X[��{v�VuL}X~�Q/sȬ<	�UT�¤DUO"��ƈ�ώ�c8�\L5ttM,L`0��̒���W]f��C3�P�m]��a�S��Ϙ�i��!���̿�»Y�t[]ߖ3#��[lƀ�*A1	(�~�V�������ax�Eg���F�TҜ�)H�'l7�f���E[]�c����Y�z��X�����@�2�&P�1T#]:��8"���@�E
T i%��q���z�m��i(	�=�D��ȁ��|�a ���@T�?�� �נ=.o��ĐG���
^.vܴ���˾��T}���J7.�^�	v-hM=��f9�Wq����&*{��2jb�F�+c$���=��8�a^z@.����9���^({�n}�9��7z�!ܭ�]�s�TJ���fR�
�X��T:i�*�inM"�P8�FA�uף�LހS�����!D��,�F+."Α�i%MP9F]f�&�M]�4�)O�ޗ=�M[�!7�H�@��(A4NF��(��	�� ���r����	s�cR�$c����8����BK~�`�[,Jr��@��=
$X�T�� ��bi��$�Ii,c5���B�"a�aڬ\g/5?�80�u=��+��t��'ÊvS�б;@�Ov(��Թ0ԙv�_2nh 	ަ�z�����e����[0Cʩp,��3L�Z� ����ބ��QO�� ���� @<V��h�@ H�c}_��� �+���7��TO(�ENLSh�w�vY������|��&�l�q`&6)R�ޣs$��bX��ji\�G��G��	�7h��e��A��Թ�I�d!L���G��DT
H�LdK`s�(i����zP��|���<��?�P6�ZZ��F��K�^�Mh���10c5#�6�NT�Й���X��0�#����J%��x�H�T������ ɜ3�R�~q Hn��tG��1,+���D���>v�#뇡Y0��-j�R��Wp�zIR؈�G�c4>a���ئ�Ɋ7�s>+�Ʀ`!y"��@I(�L��2&��FH� ��G*C�r�l��F�8�2%�L9�*�"D)f�%��@�TĤ	�3#ܴzv�O	�5"����o�}j2uP;�E����!:��@
�*�bm6��x��&�e[n��n�$_���uS����=���z_.3��� ,��3�s�]d��;�Y���������#�Je�=
�R�D�������ȏ���6��nU�X�@�\���L��	�b,ä�!N�Q�3�%��8�={��&l���͊Y�(�g!� �E�s��e[��Vrd-�i�@ΝJ��8@f�&��@�a�9�P�>�r�]��p �n`F���wk)X�4�J�y�<�|��PE�5Q�"�,VV��;Z�#!K��C�D��i�lu�\#V`�f>�(dr���������A��-�\Oo$zc����˗�J.n���a�1ɘ���)v�x��(���vW.���D��!J����r�Y�۶i�v�n5ҩ`���F*�ϝ�&�� ,0�WŲ&PW��}g�X���l� \��
`����x�f�ju[.EK~ t_��S��i�z㜌[I+��1O��a��p���{N�k�ʛ�*�J�w>�O�4��r�U0�P��M]��D:CA����H
n�L�],K�bW�b_��#��X�.^��S�j��
��S��FtL���H����c�D���!vq*�)�����V�"����4�q�z�̟B.|+�Ueǀ]� 2��5�ɁϞ����58��d<��Y')+C�!�Vȋ���T`�M���'ЈM��%�qrۦ'�ʀ3�p�^u�6�5����nn0�JS��ӽ�ȴ	�$�aVwt��n�s�{�i�F�+,`�G{|U����~��'rY���b��y�.y�[a/��6:�.�'ԈU�2��蝗�ǔ�P,4HA.%��DP*#��_y34��3���L��y��:��A%�:AڀN3+�X��nl�}�+���;���q@@ �J��q|J��뱚�L��Di\����D脙�A�@�hz@���@XP��|/X>��[�Xǔ�q+�&An����_���W�蹕�� U&o��cTi����#<���P���<ѧ��\�穘�_�c����8�X �  C���	MšM�53#�#<"��3�re�T&r[��~���:*���I��q������0�RK�[�_q�׼�ĥ6<�Z�94���&�<�oK��-��q>�M������b�����Iƣja�3F�9�'����˩?�C{�I���� ��X*����):`��6Z���Jvb��46���S�Hb�:z~���b'�Ԇ
�|1�)S�y@:�(U�ai�i0.[p9�\��2�i�_S��tN�ny8$E��M��a�BPJ+Ji�#2��:PD�A��kJc�УWO.�r�P�wC�K�s��2p[�X�7Q	}t=��1t8 �S1hsxj�_����?n���?��	��* S�,H�'�*�4�Q�����e�h��x�����r���"��Gg���"�e�`5�8VC�������;��4N�s1�$�Z+�Y��}�q��T`�m��'Fܟ3���1K6�q[O�ƣHf�*�˦+G�Q�r��b�&�V�iB��j�Z�� ��,לJ�3����Od�2`�*��'�u��EOn�29\��Й�2�[������{�y��Ϗ���?6�N�4`>?��z��ݭ�x�{cAwq_�c[�`���/BP��B7n���	���ȅ��K��Ԏ�);��U�J	)b��Hbښ2�4	��N��.�R�X�1�nK�0]��"��[�>{�\N��&b>ϩ�t�4,ł��7�-�c�Ҁ  ��,�0���M#2�9}�z9�)Z��Wx��`ŏ�[v��M&���%�{m�67��De	�f��n&ͺa?��c�i�izX�.��v�M�� ytW���9�OP���o��D�b�&����^o���]�k<P�s�8(�m��wQ���g�e������C��F�3���~|Qu�x�:^��5�sU�M]]��m�=.�W��y��_��ESՓ���m����;�����g�v��?.��>z�/^5r��Ew�|p����oWX��ޔM]T�������l�Zvc��۶���}�xh���4����X- b������ŽX]�LŔ��rl�
�Đ��������� ��l%�͗��|�m�щ�jJc�<�G��T��?�Dj�o󎦆N
��h^G���j�=y���(���s,��<���lN��g���^@X���#���ٜy�,��9D,�6��[.TD��1���	�N��������  �Qm�kd�Dـ���멣�v��x��l��r��/r&Sm����5�98Qo���D��b�h��[���C��M��G��H,zr�z �,��|'�2O��?��:��ʷ̙�z.E��n�:����I������\Gc�d}:��C��6h�q�#�L=7S�c�@���U
s���an<d����!sn�t���Ԕ�ab�� S�@�Ck^��i������������-'C�b۩������u�z�5�G/b[�kl�NDl��C�����w#�Q���rbR�Hݧ���%B�28�~��e�᱃���ڳu����3*X�pfS���87�=��#�x��{��М�ȡ}����$��D����a��ƹ�%@2�f�?+"����c4���&�����tOB=��#��@z����*�Q7؈�4�3�� ^��R�O�]�_5>�y���T�b��]aT��Z���K��A��/�@�/�eW����5����:>�Ҍ��+���Ż�z�����3��?����{�����[xQ5��]�z����wS@���%,�0�gn���A���B��'?����^��2��^�� @�}�drY���jp]��G܂��Yxz��f��u�o֬e�&� x�����옛ái�B�)�r���T��Ab~hJ�?0���9[^��~ڸ?X#�o�Ӗ>(�Ǧ/��GUq:Q��i��,�]�G���=<��������F9��H����ġ^����_.A�@�Nx$��@:�9.�SC�P�^���ߠ9'g����xF�������������������s�r[�aX�14X� ��T~.�����r}Lw�ݼ�Gݯ�e��ڱ����	P�ϛ��]UWw�;r�j�o����b�e�JU_���+�gT�K���aw�G$K��'�����w�#�w�#U?�V���v}�Ǳ�갺�[LmO%Z=�yB�h�$ضV�pϺ�Z>NS1�T�P$(&�P��y�`YoRG���
�Fi��	�%d*U��K��_�?�FLj     