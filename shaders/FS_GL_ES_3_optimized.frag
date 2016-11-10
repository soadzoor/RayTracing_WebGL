#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#elif GL_FRAGMENT_PRECISION_MEDIUM
	precision mediump float;
#else
	precision lowp float;
#endif
struct Ray {
  vec3 origin;
  vec3 dir;
};
struct Material {
  vec3 amb;
  vec3 dif;
  vec3 spec;
  float pow;
  bool refractive;
  bool reflective;
  vec3 f0;
  float n;
};
struct Stack {
  Ray ray;
  vec3 coeff;
  int depth;
};
in vec3 vsRay;
out lowp vec4 fragColor;
uniform vec3 eye;
uniform sampler2D sunTexture;
uniform sampler2D earthTexture;
uniform sampler2D earthNormalMap;
uniform sampler2D moonTexture;
uniform sampler2D moonNormalMap;
uniform sampler2D groundTexture;
uniform sampler2D skyboxTextureBack;
uniform sampler2D skyboxTextureDown;
uniform sampler2D skyboxTextureFront;
uniform sampler2D skyboxTextureLeft;
uniform sampler2D skyboxTextureRight;
uniform sampler2D skyboxTextureUp;
uniform vec4 spheres[10];
uniform float time;
uniform highp int depth;
uniform bool isShadowOn;
uniform bool useNormalMap;
uniform bool isGlowOn;
uniform int colorModeInTernary[3];
void main ()
{
  Ray ray_1;
  ray_1.origin = eye;
  ray_1.dir = normalize(vsRay);
  highp int i_2;
  bool continueLoop_3;
  lowp vec3 coeff_4;
  highp int bounceCount_5;
  highp int stackSize_6;
  Stack stack_7[8];
  lowp float v_8;
  lowp float u_9;
  highp int tmpvar_10;
  lowp float tmpvar_11;
  lowp vec3 tmpvar_12;
  lowp vec3 tmpvar_13;
  vec3 tmpvar_14;
  lowp vec3 color_15;
  color_15 = vec3(0.0, 0.0, 0.0);
  stackSize_6 = 0;
  bounceCount_5 = 1;
  coeff_4 = vec3(1.0, 1.0, 1.0);
  continueLoop_3 = bool(1);
  i_2 = 0;
  while (true) {
    if ((i_2 >= 16)) {
      break;
    };
    if (!(continueLoop_3)) {
      break;
    };
    vec3 tmpvar_16;
    vec3 tmpvar_17;
    tmpvar_16 = ray_1.origin;
    tmpvar_17 = ray_1.dir;
    highp int tmpvar_18;
    lowp float tmpvar_19;
    lowp vec3 tmpvar_20;
    lowp vec3 tmpvar_21;
    vec3 tmpvar_22;
    tmpvar_18 = tmpvar_10;
    tmpvar_19 = tmpvar_11;
    tmpvar_20 = tmpvar_12;
    tmpvar_21 = tmpvar_13;
    tmpvar_22 = tmpvar_14;
    bool hit_24;
    lowp float minT_25;
    minT_25 = -1.0;
    hit_24 = bool(0);
    for (highp int i_23 = 0; i_23 < 10; i_23++) {
      vec4 sphere_26;
      sphere_26 = spheres[i_23];
      highp int tmpvar_27;
      lowp float tmpvar_28;
      lowp vec3 tmpvar_29;
      lowp vec3 tmpvar_30;
      vec3 tmpvar_31;
      bool tmpvar_32;
      float t_33;
      float t2_34;
      float t1_35;
      vec3 tmpvar_36;
      tmpvar_36 = (tmpvar_16 - sphere_26.xyz);
      float tmpvar_37;
      tmpvar_37 = (dot (tmpvar_36, tmpvar_17) * 2.0);
      float tmpvar_38;
      tmpvar_38 = dot (tmpvar_17, tmpvar_17);
      float tmpvar_39;
      tmpvar_39 = ((tmpvar_37 * tmpvar_37) - ((4.0 * tmpvar_38) * (
        dot (tmpvar_36, tmpvar_36)
       - 
        (sphere_26.w * sphere_26.w)
      )));
      if ((tmpvar_39 < 0.0)) {
        tmpvar_32 = bool(0);
      } else {
        float tmpvar_40;
        tmpvar_40 = sqrt(tmpvar_39);
        float tmpvar_41;
        tmpvar_41 = (((
          -(tmpvar_37)
         + tmpvar_40) / 2.0) / tmpvar_38);
        t1_35 = tmpvar_41;
        float tmpvar_42;
        tmpvar_42 = (((
          -(tmpvar_37)
         - tmpvar_40) / 2.0) / tmpvar_38);
        t2_34 = tmpvar_42;
        if ((tmpvar_41 < 0.001)) {
          t1_35 = -0.001;
        };
        if ((tmpvar_42 < 0.001)) {
          t2_34 = -0.001;
        };
        if ((t1_35 < 0.0)) {
          tmpvar_32 = bool(0);
        } else {
          if ((t2_34 > 0.0)) {
            t_33 = t2_34;
          } else {
            t_33 = t1_35;
          };
          tmpvar_27 = i_23;
          tmpvar_28 = t_33;
          tmpvar_31 = sphere_26.xyz;
          tmpvar_29 = (tmpvar_16 + (t_33 * tmpvar_17));
          tmpvar_30 = normalize((tmpvar_29 - sphere_26.xyz));
          tmpvar_32 = bool(1);
        };
      };
      if (tmpvar_32) {
        if (((tmpvar_28 < minT_25) || (minT_25 < 0.0))) {
          minT_25 = tmpvar_28;
          tmpvar_18 = tmpvar_27;
          tmpvar_19 = tmpvar_28;
          tmpvar_20 = tmpvar_29;
          tmpvar_21 = tmpvar_30;
          tmpvar_22 = tmpvar_31;
        };
        hit_24 = bool(1);
      };
    };
    lowp float tmpvar_43;
    lowp vec3 tmpvar_44;
    bool tmpvar_45;
    float t1_46;
    float v_47;
    float u_48;
    float invDet_49;
    vec3 T_50;
    vec3 tmpvar_51;
    tmpvar_51 = ((tmpvar_17.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_17.zxy * vec3(-19.0, 2.0, 28.0)));
    invDet_49 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_51)));
    T_50 = (tmpvar_16 - vec3(-14.0, 14.0, -14.0));
    u_48 = (dot (T_50, tmpvar_51) * invDet_49);
    if (((u_48 < 0.0) || (u_48 > 1.0))) {
      tmpvar_45 = bool(0);
    } else {
      vec3 tmpvar_52;
      tmpvar_52 = ((T_50.yzx * vec3(2.0, 0.0, -19.0)) - (T_50.zxy * vec3(-19.0, 2.0, 0.0)));
      v_47 = (dot (tmpvar_17, tmpvar_52) * invDet_49);
      if (((v_47 < 0.0) || ((u_48 + v_47) > 1.0))) {
        tmpvar_45 = bool(0);
      } else {
        t1_46 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_52) * invDet_49);
        if ((t1_46 > 0.001)) {
          tmpvar_43 = t1_46;
          tmpvar_44 = (tmpvar_16 + (tmpvar_17 * t1_46));
          tmpvar_45 = bool(1);
        } else {
          tmpvar_45 = bool(0);
        };
      };
    };
    if (tmpvar_45) {
      if (((tmpvar_43 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_43;
        tmpvar_18 = 10;
        tmpvar_19 = tmpvar_43;
        tmpvar_20 = tmpvar_44;
        tmpvar_21 = vec3(0.0, 0.1046848, 0.9945055);
        tmpvar_22 = vec3(-4.666667, 1.333333, -12.66667);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_53;
    lowp vec3 tmpvar_54;
    bool tmpvar_55;
    float t1_56;
    float v_57;
    float u_58;
    float invDet_59;
    vec3 T_60;
    vec3 tmpvar_61;
    tmpvar_61 = ((tmpvar_17.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_17.zxy * vec3(0.0, 0.0, 28.0)));
    invDet_59 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_61)));
    T_60 = (tmpvar_16 - vec3(-14.0, 14.0, -14.0));
    u_58 = (dot (T_60, tmpvar_61) * invDet_59);
    if (((u_58 < 0.0) || (u_58 > 1.0))) {
      tmpvar_55 = bool(0);
    } else {
      vec3 tmpvar_62;
      tmpvar_62 = ((T_60.yzx * vec3(2.0, 28.0, -19.0)) - (T_60.zxy * vec3(-19.0, 2.0, 28.0)));
      v_57 = (dot (tmpvar_17, tmpvar_62) * invDet_59);
      if (((v_57 < 0.0) || ((u_58 + v_57) > 1.0))) {
        tmpvar_55 = bool(0);
      } else {
        t1_56 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_62) * invDet_59);
        if ((t1_56 > 0.001)) {
          tmpvar_53 = t1_56;
          tmpvar_54 = (tmpvar_16 + (tmpvar_17 * t1_56));
          tmpvar_55 = bool(1);
        } else {
          tmpvar_55 = bool(0);
        };
      };
    };
    if (tmpvar_55) {
      if (((tmpvar_53 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_53;
        tmpvar_18 = 11;
        tmpvar_19 = tmpvar_53;
        tmpvar_20 = tmpvar_54;
        tmpvar_21 = vec3(-0.0, 0.1046848, 0.9945055);
        tmpvar_22 = vec3(4.666667, 7.666667, -13.33333);
      };
      hit_24 = bool(1);
    };
    bool tmpvar_63;
    lowp float tmpvar_64;
    lowp vec3 tmpvar_65;
    bool tmpvar_66;
    lowp float tmpvar_67;
    tmpvar_67 = ((vec3(0.0, -10.0, 0.0) - tmpvar_16).y / tmpvar_17.y);
    if ((tmpvar_67 < 0.001)) {
      tmpvar_66 = bool(0);
    } else {
      tmpvar_64 = tmpvar_67;
      tmpvar_65 = (tmpvar_16 + (tmpvar_67 * tmpvar_17));
      tmpvar_66 = bool(1);
    };
    if (tmpvar_66) {
      lowp vec3 tmpvar_68;
      tmpvar_68 = ((tmpvar_16 + (tmpvar_64 * tmpvar_17)) - vec3(0.0, -10.0, 0.0));
      lowp float tmpvar_69;
      tmpvar_69 = sqrt(dot (tmpvar_68, tmpvar_68));
      if ((tmpvar_69 > 30.0)) {
        tmpvar_63 = bool(0);
      } else {
        tmpvar_63 = bool(1);
      };
    } else {
      tmpvar_63 = bool(0);
    };
    if (tmpvar_63) {
      if (((tmpvar_64 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_64;
        tmpvar_18 = 12;
        tmpvar_19 = tmpvar_64;
        tmpvar_20 = tmpvar_65;
        tmpvar_21 = vec3(0.0, 1.0, 0.0);
        tmpvar_22 = vec3(0.0, -10.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_70;
    lowp vec3 tmpvar_71;
    bool tmpvar_72;
    lowp float tmpvar_73;
    tmpvar_73 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_16)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_17));
    if ((tmpvar_73 < 0.001)) {
      tmpvar_72 = bool(0);
    } else {
      tmpvar_70 = tmpvar_73;
      tmpvar_71 = (tmpvar_16 + (tmpvar_73 * tmpvar_17));
      tmpvar_72 = bool(1);
    };
    if (tmpvar_72) {
      if (((tmpvar_70 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_70;
        tmpvar_18 = 14;
        tmpvar_19 = tmpvar_70;
        tmpvar_20 = tmpvar_71;
        tmpvar_21 = vec3(0.0, 0.0, -1.0);
        tmpvar_22 = vec3(0.0, 0.0, 10000.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_74;
    lowp vec3 tmpvar_75;
    bool tmpvar_76;
    lowp float tmpvar_77;
    tmpvar_77 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_16).y / tmpvar_17.y);
    if ((tmpvar_77 < 0.001)) {
      tmpvar_76 = bool(0);
    } else {
      tmpvar_74 = tmpvar_77;
      tmpvar_75 = (tmpvar_16 + (tmpvar_77 * tmpvar_17));
      tmpvar_76 = bool(1);
    };
    if (tmpvar_76) {
      if (((tmpvar_74 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_74;
        tmpvar_18 = 15;
        tmpvar_19 = tmpvar_74;
        tmpvar_20 = tmpvar_75;
        tmpvar_21 = vec3(0.0, 1.0, 0.0);
        tmpvar_22 = vec3(0.0, -10000.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_78;
    lowp vec3 tmpvar_79;
    bool tmpvar_80;
    lowp float tmpvar_81;
    tmpvar_81 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_16).z / tmpvar_17.z);
    if ((tmpvar_81 < 0.001)) {
      tmpvar_80 = bool(0);
    } else {
      tmpvar_78 = tmpvar_81;
      tmpvar_79 = (tmpvar_16 + (tmpvar_81 * tmpvar_17));
      tmpvar_80 = bool(1);
    };
    if (tmpvar_80) {
      if (((tmpvar_78 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_78;
        tmpvar_18 = 16;
        tmpvar_19 = tmpvar_78;
        tmpvar_20 = tmpvar_79;
        tmpvar_21 = vec3(0.0, 0.0, 1.0);
        tmpvar_22 = vec3(0.0, 0.0, -10000.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_82;
    lowp vec3 tmpvar_83;
    bool tmpvar_84;
    lowp float tmpvar_85;
    tmpvar_85 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_16).x / tmpvar_17.x);
    if ((tmpvar_85 < 0.001)) {
      tmpvar_84 = bool(0);
    } else {
      tmpvar_82 = tmpvar_85;
      tmpvar_83 = (tmpvar_16 + (tmpvar_85 * tmpvar_17));
      tmpvar_84 = bool(1);
    };
    if (tmpvar_84) {
      if (((tmpvar_82 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_82;
        tmpvar_18 = 17;
        tmpvar_19 = tmpvar_82;
        tmpvar_20 = tmpvar_83;
        tmpvar_21 = vec3(1.0, 0.0, 0.0);
        tmpvar_22 = vec3(-10000.0, 0.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_86;
    lowp vec3 tmpvar_87;
    bool tmpvar_88;
    lowp float tmpvar_89;
    tmpvar_89 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_16)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_17));
    if ((tmpvar_89 < 0.001)) {
      tmpvar_88 = bool(0);
    } else {
      tmpvar_86 = tmpvar_89;
      tmpvar_87 = (tmpvar_16 + (tmpvar_89 * tmpvar_17));
      tmpvar_88 = bool(1);
    };
    if (tmpvar_88) {
      if (((tmpvar_86 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_86;
        tmpvar_18 = 18;
        tmpvar_19 = tmpvar_86;
        tmpvar_20 = tmpvar_87;
        tmpvar_21 = vec3(-1.0, 0.0, 0.0);
        tmpvar_22 = vec3(10000.0, 0.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_90;
    lowp vec3 tmpvar_91;
    bool tmpvar_92;
    lowp float tmpvar_93;
    tmpvar_93 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_16)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_17));
    if ((tmpvar_93 < 0.001)) {
      tmpvar_92 = bool(0);
    } else {
      tmpvar_90 = tmpvar_93;
      tmpvar_91 = (tmpvar_16 + (tmpvar_93 * tmpvar_17));
      tmpvar_92 = bool(1);
    };
    if (tmpvar_92) {
      if (((tmpvar_90 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_90;
        tmpvar_18 = 19;
        tmpvar_19 = tmpvar_90;
        tmpvar_20 = tmpvar_91;
        tmpvar_21 = vec3(0.0, -1.0, 0.0);
        tmpvar_22 = vec3(0.0, 10000.0, 0.0);
      };
      hit_24 = bool(1);
    };
    tmpvar_10 = tmpvar_18;
    tmpvar_11 = tmpvar_19;
    tmpvar_12 = tmpvar_20;
    tmpvar_13 = tmpvar_21;
    tmpvar_14 = tmpvar_22;
    if (hit_24) {
      lowp float vec_y_94;
      vec_y_94 = -(tmpvar_21.z);
      lowp float vec_x_95;
      vec_x_95 = -(tmpvar_21.x);
      lowp float tmpvar_96;
      lowp float tmpvar_97;
      tmpvar_97 = (min (abs(
        (vec_y_94 / vec_x_95)
      ), 1.0) / max (abs(
        (vec_y_94 / vec_x_95)
      ), 1.0));
      lowp float tmpvar_98;
      tmpvar_98 = (tmpvar_97 * tmpvar_97);
      tmpvar_98 = (((
        ((((
          ((((-0.01213232 * tmpvar_98) + 0.05368138) * tmpvar_98) - 0.1173503)
         * tmpvar_98) + 0.1938925) * tmpvar_98) - 0.3326756)
       * tmpvar_98) + 0.9999793) * tmpvar_97);
      tmpvar_98 = (tmpvar_98 + (float(
        (abs((vec_y_94 / vec_x_95)) > 1.0)
      ) * (
        (tmpvar_98 * -2.0)
       + 1.570796)));
      tmpvar_96 = (tmpvar_98 * sign((vec_y_94 / vec_x_95)));
      if ((abs(vec_x_95) > (1e-08 * abs(vec_y_94)))) {
        if ((vec_x_95 < 0.0)) {
          if ((vec_y_94 >= 0.0)) {
            tmpvar_96 += 3.141593;
          } else {
            tmpvar_96 = (tmpvar_96 - 3.141593);
          };
        };
      } else {
        tmpvar_96 = (sign(vec_y_94) * 1.570796);
      };
      u_9 = (0.5 - (tmpvar_96 / 6.283185));
      lowp float x_99;
      x_99 = -(tmpvar_21.y);
      v_8 = (0.5 + ((
        sign(x_99)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_99)
        )) * (1.570796 + (
          abs(x_99)
         * 
          (-0.2146018 + (abs(x_99) * (0.08656672 + (
            abs(x_99)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_18 == 3)) {
          lowp vec3 normalFromMap_100;
          u_9 = (u_9 + (time / 2.0));
          lowp vec2 tmpvar_101;
          tmpvar_101.x = u_9;
          tmpvar_101.y = v_8;
          normalFromMap_100 = normalize(((2.0 * texture (earthNormalMap, tmpvar_101).xyz) - 1.0));
          lowp mat3 tmpvar_102;
          lowp float tmpvar_103;
          tmpvar_103 = (1.570796 - (sign(tmpvar_21.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_21.z))) * (1.570796 + (abs(tmpvar_21.z) * (-0.2146018 + 
              (abs(tmpvar_21.z) * (0.08656672 + (abs(tmpvar_21.z) * -0.03102955)))
            ))))
          )));
          lowp vec3 tmpvar_104;
          tmpvar_104 = ((tmpvar_21.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_21.zxy * vec3(0.0, 1.0, 0.0)));
          lowp float tmpvar_105;
          tmpvar_105 = sqrt(dot (tmpvar_104, tmpvar_104));
          if ((tmpvar_105 < 0.001)) {
            tmpvar_102 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            lowp vec3 tmpvar_106;
            tmpvar_106 = normalize(tmpvar_104);
            lowp float tmpvar_107;
            tmpvar_107 = sin(tmpvar_103);
            lowp float tmpvar_108;
            tmpvar_108 = cos(tmpvar_103);
            lowp float tmpvar_109;
            tmpvar_109 = (1.0 - tmpvar_108);
            lowp mat3 tmpvar_110;
            tmpvar_110[uint(0)].x = (((tmpvar_109 * tmpvar_106.x) * tmpvar_106.x) + tmpvar_108);
            tmpvar_110[uint(0)].y = (((tmpvar_109 * tmpvar_106.x) * tmpvar_106.y) - (tmpvar_106.z * tmpvar_107));
            tmpvar_110[uint(0)].z = (((tmpvar_109 * tmpvar_106.z) * tmpvar_106.x) + (tmpvar_106.y * tmpvar_107));
            tmpvar_110[1u].x = (((tmpvar_109 * tmpvar_106.x) * tmpvar_106.y) + (tmpvar_106.z * tmpvar_107));
            tmpvar_110[1u].y = (((tmpvar_109 * tmpvar_106.y) * tmpvar_106.y) + tmpvar_108);
            tmpvar_110[1u].z = (((tmpvar_109 * tmpvar_106.y) * tmpvar_106.z) - (tmpvar_106.x * tmpvar_107));
            tmpvar_110[2u].x = (((tmpvar_109 * tmpvar_106.z) * tmpvar_106.x) - (tmpvar_106.y * tmpvar_107));
            tmpvar_110[2u].y = (((tmpvar_109 * tmpvar_106.y) * tmpvar_106.z) + (tmpvar_106.x * tmpvar_107));
            tmpvar_110[2u].z = (((tmpvar_109 * tmpvar_106.z) * tmpvar_106.z) + tmpvar_108);
            tmpvar_102 = tmpvar_110;
          };
          tmpvar_13 = (tmpvar_102 * normalFromMap_100);
        } else {
          if ((tmpvar_18 == 4)) {
            lowp vec3 normalFromMap_111;
            u_9 = (u_9 + (time / 7.0));
            lowp vec2 tmpvar_112;
            tmpvar_112.x = u_9;
            tmpvar_112.y = v_8;
            normalFromMap_111 = normalize(((2.0 * texture (moonNormalMap, tmpvar_112).xyz) - 1.0));
            lowp mat3 tmpvar_113;
            lowp float tmpvar_114;
            tmpvar_114 = (1.570796 - (sign(tmpvar_13.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_13.z))) * (1.570796 + (abs(tmpvar_13.z) * (-0.2146018 + 
                (abs(tmpvar_13.z) * (0.08656672 + (abs(tmpvar_13.z) * -0.03102955)))
              ))))
            )));
            lowp vec3 tmpvar_115;
            tmpvar_115 = ((tmpvar_13.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_13.zxy * vec3(0.0, 1.0, 0.0)));
            lowp float tmpvar_116;
            tmpvar_116 = sqrt(dot (tmpvar_115, tmpvar_115));
            if ((tmpvar_116 < 0.001)) {
              tmpvar_113 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              lowp vec3 tmpvar_117;
              tmpvar_117 = normalize(tmpvar_115);
              lowp float tmpvar_118;
              tmpvar_118 = sin(tmpvar_114);
              lowp float tmpvar_119;
              tmpvar_119 = cos(tmpvar_114);
              lowp float tmpvar_120;
              tmpvar_120 = (1.0 - tmpvar_119);
              lowp mat3 tmpvar_121;
              tmpvar_121[uint(0)].x = (((tmpvar_120 * tmpvar_117.x) * tmpvar_117.x) + tmpvar_119);
              tmpvar_121[uint(0)].y = (((tmpvar_120 * tmpvar_117.x) * tmpvar_117.y) - (tmpvar_117.z * tmpvar_118));
              tmpvar_121[uint(0)].z = (((tmpvar_120 * tmpvar_117.z) * tmpvar_117.x) + (tmpvar_117.y * tmpvar_118));
              tmpvar_121[1u].x = (((tmpvar_120 * tmpvar_117.x) * tmpvar_117.y) + (tmpvar_117.z * tmpvar_118));
              tmpvar_121[1u].y = (((tmpvar_120 * tmpvar_117.y) * tmpvar_117.y) + tmpvar_119);
              tmpvar_121[1u].z = (((tmpvar_120 * tmpvar_117.y) * tmpvar_117.z) - (tmpvar_117.x * tmpvar_118));
              tmpvar_121[2u].x = (((tmpvar_120 * tmpvar_117.z) * tmpvar_117.x) - (tmpvar_117.y * tmpvar_118));
              tmpvar_121[2u].y = (((tmpvar_120 * tmpvar_117.y) * tmpvar_117.z) + (tmpvar_117.x * tmpvar_118));
              tmpvar_121[2u].z = (((tmpvar_120 * tmpvar_117.z) * tmpvar_117.z) + tmpvar_119);
              tmpvar_113 = tmpvar_121;
            };
            tmpvar_13 = (tmpvar_113 * normalFromMap_111);
          };
        };
      };
      bounceCount_5++;
      lowp vec3 tmpvar_122;
      bool tmpvar_123;
      bool tmpvar_124;
      vec3 tmpvar_125;
      float tmpvar_126;
      Material tmpvar_127;
      if ((tmpvar_18 == 0)) {
        tmpvar_127 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_18 == 1)) {
          tmpvar_127 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 2)) {
            tmpvar_127 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 3)) {
              tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 4)) {
                tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 5)) {
                  tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 6)) {
                    tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 7)) {
                      tmpvar_127 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 8)) {
                        tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_18 == 9)) {
                          tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                            tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                              tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if ((tmpvar_18 == 12)) {
                                tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_18 > 13)) {
                                  tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  tmpvar_127 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      tmpvar_122 = tmpvar_127.amb;
      tmpvar_123 = tmpvar_127.refractive;
      tmpvar_124 = tmpvar_127.reflective;
      tmpvar_125 = tmpvar_127.f0;
      tmpvar_126 = tmpvar_127.n;
      lowp vec3 tmpvar_128;
      if ((tmpvar_18 == 0)) {
        tmpvar_128 = tmpvar_122;
      } else {
        lowp float diffintensity_129;
        lowp vec3 toLight_130;
        lowp vec3 specular_131;
        lowp vec3 diffuse_132;
        lowp vec3 color_133;
        lowp vec3 refDir_134;
        lowp vec3 I_135;
        I_135 = (tmpvar_20 - ray_1.origin);
        refDir_134 = normalize((I_135 - (2.0 * 
          (dot (tmpvar_13, I_135) * tmpvar_13)
        )));
        lowp vec3 tmpvar_136;
        Material tmpvar_137;
        if ((tmpvar_18 == 0)) {
          tmpvar_137 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_137 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_137 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_137 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_137 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_136 = tmpvar_137.amb;
        color_133 = tmpvar_136;
        diffuse_132 = vec3(0.0, 0.0, 0.0);
        specular_131 = vec3(0.0, 0.0, 0.0);
        lowp vec3 tmpvar_138;
        tmpvar_138 = normalize(-(tmpvar_20));
        toLight_130 = tmpvar_138;
        diffintensity_129 = clamp (dot (tmpvar_13, tmpvar_138), 0.0, 1.0);
        vec3 tmpvar_139;
        Material tmpvar_140;
        if ((tmpvar_18 == 0)) {
          tmpvar_140 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_140 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_140 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_140 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_140 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_139 = tmpvar_140.spec;
        lowp float tmpvar_141;
        tmpvar_141 = clamp (dot (tmpvar_138, refDir_134), 0.0, 1.0);
        Material tmpvar_142;
        if ((tmpvar_18 == 0)) {
          tmpvar_142 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_142 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_142 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_142 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_142 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        specular_131 = clamp ((tmpvar_139 * pow (tmpvar_141, tmpvar_142.pow)), 0.0, 1.0);
        Material tmpvar_143;
        if ((tmpvar_18 == 0)) {
          tmpvar_143 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_143 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_143 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_143 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_143 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        diffuse_132 = clamp ((tmpvar_143.dif * diffintensity_129), 0.0, 1.0);
        if (isShadowOn) {
          lowp vec3 tmpvar_144;
          lowp vec3 tmpvar_145;
          tmpvar_144 = (tmpvar_20 + (tmpvar_13 * 0.001));
          tmpvar_145 = normalize(-(tmpvar_20));
          highp int tmpvar_146;
          tmpvar_146 = tmpvar_18;
          highp int i_147;
          lowp float minT_148;
          minT_148 = -1.0;
          i_147 = 0;
          while (true) {
            if ((i_147 >= 10)) {
              break;
            };
            vec4 sphere_149;
            sphere_149 = spheres[i_147];
            highp int tmpvar_150;
            lowp float tmpvar_151;
            bool tmpvar_152;
            lowp float t_153;
            lowp float t2_154;
            lowp float t1_155;
            lowp vec3 tmpvar_156;
            tmpvar_156 = (tmpvar_144 - sphere_149.xyz);
            lowp float tmpvar_157;
            tmpvar_157 = (dot (tmpvar_156, tmpvar_145) * 2.0);
            lowp float tmpvar_158;
            tmpvar_158 = dot (tmpvar_145, tmpvar_145);
            lowp float tmpvar_159;
            tmpvar_159 = ((tmpvar_157 * tmpvar_157) - ((4.0 * tmpvar_158) * (
              dot (tmpvar_156, tmpvar_156)
             - 
              (sphere_149.w * sphere_149.w)
            )));
            if ((tmpvar_159 < 0.0)) {
              tmpvar_152 = bool(0);
            } else {
              lowp float tmpvar_160;
              tmpvar_160 = sqrt(tmpvar_159);
              lowp float tmpvar_161;
              tmpvar_161 = (((
                -(tmpvar_157)
               + tmpvar_160) / 2.0) / tmpvar_158);
              t1_155 = tmpvar_161;
              lowp float tmpvar_162;
              tmpvar_162 = (((
                -(tmpvar_157)
               - tmpvar_160) / 2.0) / tmpvar_158);
              t2_154 = tmpvar_162;
              if ((tmpvar_161 < 0.001)) {
                t1_155 = -0.001;
              };
              if ((tmpvar_162 < 0.001)) {
                t2_154 = -0.001;
              };
              if ((t1_155 < 0.0)) {
                tmpvar_152 = bool(0);
              } else {
                if ((t2_154 > 0.0)) {
                  t_153 = t2_154;
                } else {
                  t_153 = t1_155;
                };
                tmpvar_150 = i_147;
                tmpvar_151 = t_153;
                tmpvar_152 = bool(1);
              };
            };
            if ((tmpvar_152 && ((tmpvar_151 < minT_148) || (minT_148 < 0.0)))) {
              minT_148 = tmpvar_151;
              tmpvar_146 = tmpvar_150;
            };
            i_147++;
          };
          lowp float tmpvar_163;
          bool tmpvar_164;
          lowp float t1_165;
          lowp float v_166;
          lowp float u_167;
          lowp float invDet_168;
          lowp vec3 T_169;
          lowp vec3 tmpvar_170;
          tmpvar_170 = ((tmpvar_145.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_145.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_168 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_170)));
          T_169 = (tmpvar_144 - vec3(-14.0, 14.0, -14.0));
          u_167 = (dot (T_169, tmpvar_170) * invDet_168);
          if (((u_167 < 0.0) || (u_167 > 1.0))) {
            tmpvar_164 = bool(0);
          } else {
            lowp vec3 tmpvar_171;
            tmpvar_171 = ((T_169.yzx * vec3(2.0, 0.0, -19.0)) - (T_169.zxy * vec3(-19.0, 2.0, 0.0)));
            v_166 = (dot (tmpvar_145, tmpvar_171) * invDet_168);
            if (((v_166 < 0.0) || ((u_167 + v_166) > 1.0))) {
              tmpvar_164 = bool(0);
            } else {
              t1_165 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_171) * invDet_168);
              if ((t1_165 > 0.001)) {
                tmpvar_163 = t1_165;
                tmpvar_164 = bool(1);
              } else {
                tmpvar_164 = bool(0);
              };
            };
          };
          if ((tmpvar_164 && ((tmpvar_163 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_163;
            tmpvar_146 = 10;
          };
          lowp float tmpvar_172;
          bool tmpvar_173;
          lowp float t1_174;
          lowp float v_175;
          lowp float u_176;
          lowp float invDet_177;
          lowp vec3 T_178;
          lowp vec3 tmpvar_179;
          tmpvar_179 = ((tmpvar_145.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_145.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_177 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_179)));
          T_178 = (tmpvar_144 - vec3(-14.0, 14.0, -14.0));
          u_176 = (dot (T_178, tmpvar_179) * invDet_177);
          if (((u_176 < 0.0) || (u_176 > 1.0))) {
            tmpvar_173 = bool(0);
          } else {
            lowp vec3 tmpvar_180;
            tmpvar_180 = ((T_178.yzx * vec3(2.0, 28.0, -19.0)) - (T_178.zxy * vec3(-19.0, 2.0, 28.0)));
            v_175 = (dot (tmpvar_145, tmpvar_180) * invDet_177);
            if (((v_175 < 0.0) || ((u_176 + v_175) > 1.0))) {
              tmpvar_173 = bool(0);
            } else {
              t1_174 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_180) * invDet_177);
              if ((t1_174 > 0.001)) {
                tmpvar_172 = t1_174;
                tmpvar_173 = bool(1);
              } else {
                tmpvar_173 = bool(0);
              };
            };
          };
          if ((tmpvar_173 && ((tmpvar_172 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_172;
            tmpvar_146 = 11;
          };
          bool tmpvar_181;
          lowp float tmpvar_182;
          bool tmpvar_183;
          lowp float tmpvar_184;
          tmpvar_184 = ((vec3(0.0, -10.0, 0.0) - tmpvar_144).y / tmpvar_145.y);
          if ((tmpvar_184 < 0.001)) {
            tmpvar_183 = bool(0);
          } else {
            tmpvar_182 = tmpvar_184;
            tmpvar_183 = bool(1);
          };
          if (tmpvar_183) {
            lowp vec3 tmpvar_185;
            tmpvar_185 = ((tmpvar_144 + (tmpvar_182 * tmpvar_145)) - vec3(0.0, -10.0, 0.0));
            lowp float tmpvar_186;
            tmpvar_186 = sqrt(dot (tmpvar_185, tmpvar_185));
            if ((tmpvar_186 > 30.0)) {
              tmpvar_181 = bool(0);
            } else {
              tmpvar_181 = bool(1);
            };
          } else {
            tmpvar_181 = bool(0);
          };
          if ((tmpvar_181 && ((tmpvar_182 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_182;
            tmpvar_146 = 12;
          };
          lowp float tmpvar_187;
          bool tmpvar_188;
          lowp float tmpvar_189;
          tmpvar_189 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_144)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_145));
          if ((tmpvar_189 < 0.001)) {
            tmpvar_188 = bool(0);
          } else {
            tmpvar_187 = tmpvar_189;
            tmpvar_188 = bool(1);
          };
          if ((tmpvar_188 && ((tmpvar_187 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_187;
            tmpvar_146 = 14;
          };
          lowp float tmpvar_190;
          bool tmpvar_191;
          lowp float tmpvar_192;
          tmpvar_192 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_144).y / tmpvar_145.y);
          if ((tmpvar_192 < 0.001)) {
            tmpvar_191 = bool(0);
          } else {
            tmpvar_190 = tmpvar_192;
            tmpvar_191 = bool(1);
          };
          if ((tmpvar_191 && ((tmpvar_190 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_190;
            tmpvar_146 = 15;
          };
          lowp float tmpvar_193;
          bool tmpvar_194;
          lowp float tmpvar_195;
          tmpvar_195 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_144).z / tmpvar_145.z);
          if ((tmpvar_195 < 0.001)) {
            tmpvar_194 = bool(0);
          } else {
            tmpvar_193 = tmpvar_195;
            tmpvar_194 = bool(1);
          };
          if ((tmpvar_194 && ((tmpvar_193 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_193;
            tmpvar_146 = 16;
          };
          lowp float tmpvar_196;
          bool tmpvar_197;
          lowp float tmpvar_198;
          tmpvar_198 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_144).x / tmpvar_145.x);
          if ((tmpvar_198 < 0.001)) {
            tmpvar_197 = bool(0);
          } else {
            tmpvar_196 = tmpvar_198;
            tmpvar_197 = bool(1);
          };
          if ((tmpvar_197 && ((tmpvar_196 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_196;
            tmpvar_146 = 17;
          };
          lowp float tmpvar_199;
          bool tmpvar_200;
          lowp float tmpvar_201;
          tmpvar_201 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_144)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_145));
          if ((tmpvar_201 < 0.001)) {
            tmpvar_200 = bool(0);
          } else {
            tmpvar_199 = tmpvar_201;
            tmpvar_200 = bool(1);
          };
          if ((tmpvar_200 && ((tmpvar_199 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_199;
            tmpvar_146 = 18;
          };
          lowp float tmpvar_202;
          bool tmpvar_203;
          lowp float tmpvar_204;
          tmpvar_204 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_144)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_145));
          if ((tmpvar_204 < 0.001)) {
            tmpvar_203 = bool(0);
          } else {
            tmpvar_202 = tmpvar_204;
            tmpvar_203 = bool(1);
          };
          if ((tmpvar_203 && ((tmpvar_202 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_202;
            tmpvar_146 = 19;
          };
          if ((((
            (((tmpvar_146 != 0) && (tmpvar_146 != 5)) && (tmpvar_146 != 6))
           && 
            (tmpvar_146 != 12)
          ) && (tmpvar_146 != tmpvar_18)) && (tmpvar_18 <= 12))) {
            specular_131 = vec3(0.0, 0.0, 0.0);
            diffuse_132 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_133 = (tmpvar_136 + (diffuse_132 + specular_131));
        toLight_130 = (vec3(-2.0, 20.0, 0.0) - tmpvar_20);
        lowp vec3 tmpvar_205;
        tmpvar_205 = normalize(toLight_130);
        toLight_130 = tmpvar_205;
        diffintensity_129 = clamp (dot (tmpvar_13, tmpvar_205), 0.0, 1.0);
        vec3 tmpvar_206;
        Material tmpvar_207;
        if ((tmpvar_18 == 0)) {
          tmpvar_207 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_207 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_207 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_207 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_207 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_207 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_207 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_207 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_207 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_207 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_207 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_207 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_207 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_207 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_207 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_206 = tmpvar_207.spec;
        lowp float tmpvar_208;
        tmpvar_208 = clamp (dot (tmpvar_205, refDir_134), 0.0, 1.0);
        Material tmpvar_209;
        if ((tmpvar_18 == 0)) {
          tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_209 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_209 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_209 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        specular_131 = clamp ((tmpvar_206 * pow (tmpvar_208, tmpvar_209.pow)), 0.0, 1.0);
        Material tmpvar_210;
        if ((tmpvar_18 == 0)) {
          tmpvar_210 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_210 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_210 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_210 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_210 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        diffuse_132 = clamp ((tmpvar_210.dif * diffintensity_129), 0.0, 1.0);
        if (isShadowOn) {
          lowp vec3 tmpvar_211;
          lowp vec3 tmpvar_212;
          tmpvar_211 = (tmpvar_20 + (tmpvar_13 * 0.001));
          tmpvar_212 = normalize((vec3(-2.0, 20.0, 0.0) - tmpvar_20));
          highp int tmpvar_213;
          tmpvar_213 = tmpvar_18;
          highp int i_214;
          lowp float minT_215;
          minT_215 = -1.0;
          i_214 = 0;
          while (true) {
            if ((i_214 >= 10)) {
              break;
            };
            vec4 sphere_216;
            sphere_216 = spheres[i_214];
            highp int tmpvar_217;
            lowp float tmpvar_218;
            bool tmpvar_219;
            lowp float t_220;
            lowp float t2_221;
            lowp float t1_222;
            lowp vec3 tmpvar_223;
            tmpvar_223 = (tmpvar_211 - sphere_216.xyz);
            lowp float tmpvar_224;
            tmpvar_224 = (dot (tmpvar_223, tmpvar_212) * 2.0);
            lowp float tmpvar_225;
            tmpvar_225 = dot (tmpvar_212, tmpvar_212);
            lowp float tmpvar_226;
            tmpvar_226 = ((tmpvar_224 * tmpvar_224) - ((4.0 * tmpvar_225) * (
              dot (tmpvar_223, tmpvar_223)
             - 
              (sphere_216.w * sphere_216.w)
            )));
            if ((tmpvar_226 < 0.0)) {
              tmpvar_219 = bool(0);
            } else {
              lowp float tmpvar_227;
              tmpvar_227 = sqrt(tmpvar_226);
              lowp float tmpvar_228;
              tmpvar_228 = (((
                -(tmpvar_224)
               + tmpvar_227) / 2.0) / tmpvar_225);
              t1_222 = tmpvar_228;
              lowp float tmpvar_229;
              tmpvar_229 = (((
                -(tmpvar_224)
               - tmpvar_227) / 2.0) / tmpvar_225);
              t2_221 = tmpvar_229;
              if ((tmpvar_228 < 0.001)) {
                t1_222 = -0.001;
              };
              if ((tmpvar_229 < 0.001)) {
                t2_221 = -0.001;
              };
              if ((t1_222 < 0.0)) {
                tmpvar_219 = bool(0);
              } else {
                if ((t2_221 > 0.0)) {
                  t_220 = t2_221;
                } else {
                  t_220 = t1_222;
                };
                tmpvar_217 = i_214;
                tmpvar_218 = t_220;
                tmpvar_219 = bool(1);
              };
            };
            if ((tmpvar_219 && ((tmpvar_218 < minT_215) || (minT_215 < 0.0)))) {
              minT_215 = tmpvar_218;
              tmpvar_213 = tmpvar_217;
            };
            i_214++;
          };
          lowp float tmpvar_230;
          bool tmpvar_231;
          lowp float t1_232;
          lowp float v_233;
          lowp float u_234;
          lowp float invDet_235;
          lowp vec3 T_236;
          lowp vec3 tmpvar_237;
          tmpvar_237 = ((tmpvar_212.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_212.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_235 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_237)));
          T_236 = (tmpvar_211 - vec3(-14.0, 14.0, -14.0));
          u_234 = (dot (T_236, tmpvar_237) * invDet_235);
          if (((u_234 < 0.0) || (u_234 > 1.0))) {
            tmpvar_231 = bool(0);
          } else {
            lowp vec3 tmpvar_238;
            tmpvar_238 = ((T_236.yzx * vec3(2.0, 0.0, -19.0)) - (T_236.zxy * vec3(-19.0, 2.0, 0.0)));
            v_233 = (dot (tmpvar_212, tmpvar_238) * invDet_235);
            if (((v_233 < 0.0) || ((u_234 + v_233) > 1.0))) {
              tmpvar_231 = bool(0);
            } else {
              t1_232 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_238) * invDet_235);
              if ((t1_232 > 0.001)) {
                tmpvar_230 = t1_232;
                tmpvar_231 = bool(1);
              } else {
                tmpvar_231 = bool(0);
              };
            };
          };
          if ((tmpvar_231 && ((tmpvar_230 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_230;
            tmpvar_213 = 10;
          };
          lowp float tmpvar_239;
          bool tmpvar_240;
          lowp float t1_241;
          lowp float v_242;
          lowp float u_243;
          lowp float invDet_244;
          lowp vec3 T_245;
          lowp vec3 tmpvar_246;
          tmpvar_246 = ((tmpvar_212.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_212.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_244 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_246)));
          T_245 = (tmpvar_211 - vec3(-14.0, 14.0, -14.0));
          u_243 = (dot (T_245, tmpvar_246) * invDet_244);
          if (((u_243 < 0.0) || (u_243 > 1.0))) {
            tmpvar_240 = bool(0);
          } else {
            lowp vec3 tmpvar_247;
            tmpvar_247 = ((T_245.yzx * vec3(2.0, 28.0, -19.0)) - (T_245.zxy * vec3(-19.0, 2.0, 28.0)));
            v_242 = (dot (tmpvar_212, tmpvar_247) * invDet_244);
            if (((v_242 < 0.0) || ((u_243 + v_242) > 1.0))) {
              tmpvar_240 = bool(0);
            } else {
              t1_241 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_247) * invDet_244);
              if ((t1_241 > 0.001)) {
                tmpvar_239 = t1_241;
                tmpvar_240 = bool(1);
              } else {
                tmpvar_240 = bool(0);
              };
            };
          };
          if ((tmpvar_240 && ((tmpvar_239 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_239;
            tmpvar_213 = 11;
          };
          bool tmpvar_248;
          lowp float tmpvar_249;
          bool tmpvar_250;
          lowp float tmpvar_251;
          tmpvar_251 = ((vec3(0.0, -10.0, 0.0) - tmpvar_211).y / tmpvar_212.y);
          if ((tmpvar_251 < 0.001)) {
            tmpvar_250 = bool(0);
          } else {
            tmpvar_249 = tmpvar_251;
            tmpvar_250 = bool(1);
          };
          if (tmpvar_250) {
            lowp vec3 tmpvar_252;
            tmpvar_252 = ((tmpvar_211 + (tmpvar_249 * tmpvar_212)) - vec3(0.0, -10.0, 0.0));
            lowp float tmpvar_253;
            tmpvar_253 = sqrt(dot (tmpvar_252, tmpvar_252));
            if ((tmpvar_253 > 30.0)) {
              tmpvar_248 = bool(0);
            } else {
              tmpvar_248 = bool(1);
            };
          } else {
            tmpvar_248 = bool(0);
          };
          if ((tmpvar_248 && ((tmpvar_249 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_249;
            tmpvar_213 = 12;
          };
          lowp float tmpvar_254;
          bool tmpvar_255;
          lowp float tmpvar_256;
          tmpvar_256 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_211)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_212));
          if ((tmpvar_256 < 0.001)) {
            tmpvar_255 = bool(0);
          } else {
            tmpvar_254 = tmpvar_256;
            tmpvar_255 = bool(1);
          };
          if ((tmpvar_255 && ((tmpvar_254 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_254;
            tmpvar_213 = 14;
          };
          lowp float tmpvar_257;
          bool tmpvar_258;
          lowp float tmpvar_259;
          tmpvar_259 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_211).y / tmpvar_212.y);
          if ((tmpvar_259 < 0.001)) {
            tmpvar_258 = bool(0);
          } else {
            tmpvar_257 = tmpvar_259;
            tmpvar_258 = bool(1);
          };
          if ((tmpvar_258 && ((tmpvar_257 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_257;
            tmpvar_213 = 15;
          };
          lowp float tmpvar_260;
          bool tmpvar_261;
          lowp float tmpvar_262;
          tmpvar_262 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_211).z / tmpvar_212.z);
          if ((tmpvar_262 < 0.001)) {
            tmpvar_261 = bool(0);
          } else {
            tmpvar_260 = tmpvar_262;
            tmpvar_261 = bool(1);
          };
          if ((tmpvar_261 && ((tmpvar_260 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_260;
            tmpvar_213 = 16;
          };
          lowp float tmpvar_263;
          bool tmpvar_264;
          lowp float tmpvar_265;
          tmpvar_265 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_211).x / tmpvar_212.x);
          if ((tmpvar_265 < 0.001)) {
            tmpvar_264 = bool(0);
          } else {
            tmpvar_263 = tmpvar_265;
            tmpvar_264 = bool(1);
          };
          if ((tmpvar_264 && ((tmpvar_263 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_263;
            tmpvar_213 = 17;
          };
          lowp float tmpvar_266;
          bool tmpvar_267;
          lowp float tmpvar_268;
          tmpvar_268 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_211)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_212));
          if ((tmpvar_268 < 0.001)) {
            tmpvar_267 = bool(0);
          } else {
            tmpvar_266 = tmpvar_268;
            tmpvar_267 = bool(1);
          };
          if ((tmpvar_267 && ((tmpvar_266 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_266;
            tmpvar_213 = 18;
          };
          lowp float tmpvar_269;
          bool tmpvar_270;
          lowp float tmpvar_271;
          tmpvar_271 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_211)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_212));
          if ((tmpvar_271 < 0.001)) {
            tmpvar_270 = bool(0);
          } else {
            tmpvar_269 = tmpvar_271;
            tmpvar_270 = bool(1);
          };
          if ((tmpvar_270 && ((tmpvar_269 < minT_215) || (minT_215 < 0.0)))) {
            minT_215 = tmpvar_269;
            tmpvar_213 = 19;
          };
          if ((((
            (((tmpvar_213 != 0) && (tmpvar_213 != 5)) && (tmpvar_213 != 6))
           && 
            (tmpvar_213 != 12)
          ) && (tmpvar_213 != tmpvar_18)) && (tmpvar_18 <= 12))) {
            specular_131 = vec3(0.0, 0.0, 0.0);
            diffuse_132 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_133 = (color_133 + (diffuse_132 + specular_131));
        toLight_130 = (vec3(20.0, 20.0, 0.0) - tmpvar_20);
        lowp vec3 tmpvar_272;
        tmpvar_272 = normalize(toLight_130);
        toLight_130 = tmpvar_272;
        diffintensity_129 = clamp (dot (tmpvar_13, tmpvar_272), 0.0, 1.0);
        vec3 tmpvar_273;
        Material tmpvar_274;
        if ((tmpvar_18 == 0)) {
          tmpvar_274 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_274 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_274 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_274 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_274 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_274 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_274 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_274 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_274 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_274 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_274 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_274 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_274 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_274 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_274 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_273 = tmpvar_274.spec;
        lowp float tmpvar_275;
        tmpvar_275 = clamp (dot (tmpvar_272, refDir_134), 0.0, 1.0);
        Material tmpvar_276;
        if ((tmpvar_18 == 0)) {
          tmpvar_276 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_276 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_276 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_276 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_276 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        specular_131 = clamp ((tmpvar_273 * pow (tmpvar_275, tmpvar_276.pow)), 0.0, 1.0);
        Material tmpvar_277;
        if ((tmpvar_18 == 0)) {
          tmpvar_277 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_277 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_277 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_277 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_277 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_277 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_277 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_277 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_277 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_277 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_277 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_277 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_277 = Material(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_277 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_277 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        diffuse_132 = clamp ((tmpvar_277.dif * diffintensity_129), 0.0, 1.0);
        if (isShadowOn) {
          lowp vec3 tmpvar_278;
          lowp vec3 tmpvar_279;
          tmpvar_278 = (tmpvar_20 + (tmpvar_13 * 0.001));
          tmpvar_279 = normalize((vec3(20.0, 20.0, 0.0) - tmpvar_20));
          highp int tmpvar_280;
          tmpvar_280 = tmpvar_18;
          highp int i_281;
          lowp float minT_282;
          minT_282 = -1.0;
          i_281 = 0;
          while (true) {
            if ((i_281 >= 10)) {
              break;
            };
            vec4 sphere_283;
            sphere_283 = spheres[i_281];
            highp int tmpvar_284;
            lowp float tmpvar_285;
            bool tmpvar_286;
            lowp float t_287;
            lowp float t2_288;
            lowp float t1_289;
            lowp vec3 tmpvar_290;
            tmpvar_290 = (tmpvar_278 - sphere_283.xyz);
            lowp float tmpvar_291;
            tmpvar_291 = (dot (tmpvar_290, tmpvar_279) * 2.0);
            lowp float tmpvar_292;
            tmpvar_292 = dot (tmpvar_279, tmpvar_279);
            lowp float tmpvar_293;
            tmpvar_293 = ((tmpvar_291 * tmpvar_291) - ((4.0 * tmpvar_292) * (
              dot (tmpvar_290, tmpvar_290)
             - 
              (sphere_283.w * sphere_283.w)
            )));
            if ((tmpvar_293 < 0.0)) {
              tmpvar_286 = bool(0);
            } else {
              lowp float tmpvar_294;
              tmpvar_294 = sqrt(tmpvar_293);
              lowp float tmpvar_295;
              tmpvar_295 = (((
                -(tmpvar_291)
               + tmpvar_294) / 2.0) / tmpvar_292);
              t1_289 = tmpvar_295;
              lowp float tmpvar_296;
              tmpvar_296 = (((
                -(tmpvar_291)
               - tmpvar_294) / 2.0) / tmpvar_292);
              t2_288 = tmpvar_296;
              if ((tmpvar_295 < 0.001)) {
                t1_289 = -0.001;
              };
              if ((tmpvar_296 < 0.001)) {
                t2_288 = -0.001;
              };
              if ((t1_289 < 0.0)) {
                tmpvar_286 = bool(0);
              } else {
                if ((t2_288 > 0.0)) {
                  t_287 = t2_288;
                } else {
                  t_287 = t1_289;
                };
                tmpvar_284 = i_281;
                tmpvar_285 = t_287;
                tmpvar_286 = bool(1);
              };
            };
            if ((tmpvar_286 && ((tmpvar_285 < minT_282) || (minT_282 < 0.0)))) {
              minT_282 = tmpvar_285;
              tmpvar_280 = tmpvar_284;
            };
            i_281++;
          };
          lowp float tmpvar_297;
          bool tmpvar_298;
          lowp float t1_299;
          lowp float v_300;
          lowp float u_301;
          lowp float invDet_302;
          lowp vec3 T_303;
          lowp vec3 tmpvar_304;
          tmpvar_304 = ((tmpvar_279.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_279.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_302 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_304)));
          T_303 = (tmpvar_278 - vec3(-14.0, 14.0, -14.0));
          u_301 = (dot (T_303, tmpvar_304) * invDet_302);
          if (((u_301 < 0.0) || (u_301 > 1.0))) {
            tmpvar_298 = bool(0);
          } else {
            lowp vec3 tmpvar_305;
            tmpvar_305 = ((T_303.yzx * vec3(2.0, 0.0, -19.0)) - (T_303.zxy * vec3(-19.0, 2.0, 0.0)));
            v_300 = (dot (tmpvar_279, tmpvar_305) * invDet_302);
            if (((v_300 < 0.0) || ((u_301 + v_300) > 1.0))) {
              tmpvar_298 = bool(0);
            } else {
              t1_299 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_305) * invDet_302);
              if ((t1_299 > 0.001)) {
                tmpvar_297 = t1_299;
                tmpvar_298 = bool(1);
              } else {
                tmpvar_298 = bool(0);
              };
            };
          };
          if ((tmpvar_298 && ((tmpvar_297 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_297;
            tmpvar_280 = 10;
          };
          lowp float tmpvar_306;
          bool tmpvar_307;
          lowp float t1_308;
          lowp float v_309;
          lowp float u_310;
          lowp float invDet_311;
          lowp vec3 T_312;
          lowp vec3 tmpvar_313;
          tmpvar_313 = ((tmpvar_279.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_279.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_311 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_313)));
          T_312 = (tmpvar_278 - vec3(-14.0, 14.0, -14.0));
          u_310 = (dot (T_312, tmpvar_313) * invDet_311);
          if (((u_310 < 0.0) || (u_310 > 1.0))) {
            tmpvar_307 = bool(0);
          } else {
            lowp vec3 tmpvar_314;
            tmpvar_314 = ((T_312.yzx * vec3(2.0, 28.0, -19.0)) - (T_312.zxy * vec3(-19.0, 2.0, 28.0)));
            v_309 = (dot (tmpvar_279, tmpvar_314) * invDet_311);
            if (((v_309 < 0.0) || ((u_310 + v_309) > 1.0))) {
              tmpvar_307 = bool(0);
            } else {
              t1_308 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_314) * invDet_311);
              if ((t1_308 > 0.001)) {
                tmpvar_306 = t1_308;
                tmpvar_307 = bool(1);
              } else {
                tmpvar_307 = bool(0);
              };
            };
          };
          if ((tmpvar_307 && ((tmpvar_306 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_306;
            tmpvar_280 = 11;
          };
          bool tmpvar_315;
          lowp float tmpvar_316;
          bool tmpvar_317;
          lowp float tmpvar_318;
          tmpvar_318 = ((vec3(0.0, -10.0, 0.0) - tmpvar_278).y / tmpvar_279.y);
          if ((tmpvar_318 < 0.001)) {
            tmpvar_317 = bool(0);
          } else {
            tmpvar_316 = tmpvar_318;
            tmpvar_317 = bool(1);
          };
          if (tmpvar_317) {
            lowp vec3 tmpvar_319;
            tmpvar_319 = ((tmpvar_278 + (tmpvar_316 * tmpvar_279)) - vec3(0.0, -10.0, 0.0));
            lowp float tmpvar_320;
            tmpvar_320 = sqrt(dot (tmpvar_319, tmpvar_319));
            if ((tmpvar_320 > 30.0)) {
              tmpvar_315 = bool(0);
            } else {
              tmpvar_315 = bool(1);
            };
          } else {
            tmpvar_315 = bool(0);
          };
          if ((tmpvar_315 && ((tmpvar_316 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_316;
            tmpvar_280 = 12;
          };
          lowp float tmpvar_321;
          bool tmpvar_322;
          lowp float tmpvar_323;
          tmpvar_323 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_278)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_279));
          if ((tmpvar_323 < 0.001)) {
            tmpvar_322 = bool(0);
          } else {
            tmpvar_321 = tmpvar_323;
            tmpvar_322 = bool(1);
          };
          if ((tmpvar_322 && ((tmpvar_321 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_321;
            tmpvar_280 = 14;
          };
          lowp float tmpvar_324;
          bool tmpvar_325;
          lowp float tmpvar_326;
          tmpvar_326 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_278).y / tmpvar_279.y);
          if ((tmpvar_326 < 0.001)) {
            tmpvar_325 = bool(0);
          } else {
            tmpvar_324 = tmpvar_326;
            tmpvar_325 = bool(1);
          };
          if ((tmpvar_325 && ((tmpvar_324 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_324;
            tmpvar_280 = 15;
          };
          lowp float tmpvar_327;
          bool tmpvar_328;
          lowp float tmpvar_329;
          tmpvar_329 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_278).z / tmpvar_279.z);
          if ((tmpvar_329 < 0.001)) {
            tmpvar_328 = bool(0);
          } else {
            tmpvar_327 = tmpvar_329;
            tmpvar_328 = bool(1);
          };
          if ((tmpvar_328 && ((tmpvar_327 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_327;
            tmpvar_280 = 16;
          };
          lowp float tmpvar_330;
          bool tmpvar_331;
          lowp float tmpvar_332;
          tmpvar_332 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_278).x / tmpvar_279.x);
          if ((tmpvar_332 < 0.001)) {
            tmpvar_331 = bool(0);
          } else {
            tmpvar_330 = tmpvar_332;
            tmpvar_331 = bool(1);
          };
          if ((tmpvar_331 && ((tmpvar_330 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_330;
            tmpvar_280 = 17;
          };
          lowp float tmpvar_333;
          bool tmpvar_334;
          lowp float tmpvar_335;
          tmpvar_335 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_278)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_279));
          if ((tmpvar_335 < 0.001)) {
            tmpvar_334 = bool(0);
          } else {
            tmpvar_333 = tmpvar_335;
            tmpvar_334 = bool(1);
          };
          if ((tmpvar_334 && ((tmpvar_333 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_333;
            tmpvar_280 = 18;
          };
          lowp float tmpvar_336;
          bool tmpvar_337;
          lowp float tmpvar_338;
          tmpvar_338 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_278)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_279));
          if ((tmpvar_338 < 0.001)) {
            tmpvar_337 = bool(0);
          } else {
            tmpvar_336 = tmpvar_338;
            tmpvar_337 = bool(1);
          };
          if ((tmpvar_337 && ((tmpvar_336 < minT_282) || (minT_282 < 0.0)))) {
            minT_282 = tmpvar_336;
            tmpvar_280 = 19;
          };
          if ((((
            (((tmpvar_280 != 0) && (tmpvar_280 != 5)) && (tmpvar_280 != 6))
           && 
            (tmpvar_280 != 12)
          ) && (tmpvar_280 != tmpvar_18)) && (tmpvar_18 <= 12))) {
            specular_131 = vec3(0.0, 0.0, 0.0);
            diffuse_132 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_133 = (color_133 + (diffuse_132 + specular_131));
        tmpvar_128 = color_133;
      };
      color_15 = (color_15 + (tmpvar_128 * coeff_4));
      if ((tmpvar_18 == 0)) {
        float tmpvar_339;
        tmpvar_339 = (time / 5.0);
        u_9 = (u_9 + tmpvar_339);
        v_8 = (v_8 + tmpvar_339);
        lowp vec2 tmpvar_340;
        tmpvar_340.x = u_9;
        tmpvar_340.y = v_8;
        color_15 = (color_15 * (texture (sunTexture, tmpvar_340).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_18 == 3)) {
          if (!(useNormalMap)) {
            u_9 = (u_9 + (time / 2.0));
          };
          lowp vec2 tmpvar_341;
          tmpvar_341.x = u_9;
          tmpvar_341.y = v_8;
          color_15 = (color_15 * texture (earthTexture, tmpvar_341).xyz);
        } else {
          if ((tmpvar_18 == 4)) {
            if (!(useNormalMap)) {
              u_9 = (u_9 + (time / 7.0));
            };
            lowp vec2 tmpvar_342;
            tmpvar_342.x = u_9;
            tmpvar_342.y = v_8;
            color_15 = (color_15 * texture (moonTexture, tmpvar_342).xyz);
          } else {
            if ((tmpvar_18 == 12)) {
              color_15 = (color_15 * texture (groundTexture, (0.15 * tmpvar_20.xz)).xyz);
            } else {
              if ((tmpvar_18 == 14)) {
                color_15 = (color_15 * texture (skyboxTextureBack, ((
                  -(tmpvar_20.xy)
                 + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
              } else {
                if ((tmpvar_18 == 15)) {
                  color_15 = (color_15 * texture (skyboxTextureDown, ((tmpvar_20.xz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                } else {
                  if ((tmpvar_18 == 16)) {
                    color_15 = (color_15 * texture (skyboxTextureFront, ((
                      (tmpvar_20.xy * vec2(1.0, -1.0))
                     + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                  } else {
                    if ((tmpvar_18 == 17)) {
                      color_15 = (color_15 * texture (skyboxTextureLeft, ((tmpvar_20.yz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                    } else {
                      if ((tmpvar_18 == 18)) {
                        color_15 = (color_15 * texture (skyboxTextureRight, ((
                          (tmpvar_20.zy * vec2(1.0, -1.0))
                         + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                      } else {
                        if ((tmpvar_18 == 19)) {
                          color_15 = (color_15 * texture (skyboxTextureUp, ((tmpvar_20.xz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      bool tmpvar_343;
      tmpvar_343 = (((tmpvar_18 == 3) && (color_15.z > color_15.x)) && (color_15.z > color_15.y));
      if ((((tmpvar_124 || tmpvar_123) || tmpvar_343) && (bounceCount_5 <= depth))) {
        bool totalInternalReflection_344;
        totalInternalReflection_344 = bool(0);
        if (tmpvar_123) {
          Ray refractedRay_345;
          float tmpvar_346;
          tmpvar_346 = (1.0/(tmpvar_126));
          lowp float tmpvar_347;
          tmpvar_347 = dot (ray_1.dir, tmpvar_13);
          lowp vec3 tmpvar_348;
          if ((tmpvar_347 <= 0.0)) {
            vec3 I_349;
            I_349 = ray_1.dir;
            lowp vec3 tmpvar_350;
            lowp float tmpvar_351;
            tmpvar_351 = dot (tmpvar_13, I_349);
            lowp float tmpvar_352;
            tmpvar_352 = (1.0 - (tmpvar_346 * (tmpvar_346 * 
              (1.0 - (tmpvar_351 * tmpvar_351))
            )));
            if ((tmpvar_352 < 0.0)) {
              tmpvar_350 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_350 = ((tmpvar_346 * I_349) - ((
                (tmpvar_346 * tmpvar_351)
               + 
                sqrt(tmpvar_352)
              ) * tmpvar_13));
            };
            tmpvar_348 = tmpvar_350;
          } else {
            vec3 I_353;
            I_353 = ray_1.dir;
            lowp vec3 N_354;
            N_354 = -(tmpvar_13);
            float eta_355;
            eta_355 = (1.0/(tmpvar_346));
            lowp vec3 tmpvar_356;
            lowp float tmpvar_357;
            tmpvar_357 = dot (N_354, I_353);
            lowp float tmpvar_358;
            tmpvar_358 = (1.0 - (eta_355 * (eta_355 * 
              (1.0 - (tmpvar_357 * tmpvar_357))
            )));
            if ((tmpvar_358 < 0.0)) {
              tmpvar_356 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_356 = ((eta_355 * I_353) - ((
                (eta_355 * tmpvar_357)
               + 
                sqrt(tmpvar_358)
              ) * N_354));
            };
            tmpvar_348 = tmpvar_356;
          };
          refractedRay_345.dir = tmpvar_348;
          vec3 x_359;
          x_359 = refractedRay_345.dir;
          totalInternalReflection_344 = (sqrt(dot (x_359, x_359)) < 0.001);
          if (totalInternalReflection_344) {
            vec3 I_360;
            I_360 = ray_1.dir;
            lowp vec3 N_361;
            N_361 = -(tmpvar_13);
            ray_1.dir = normalize((I_360 - (2.0 * 
              (dot (N_361, I_360) * N_361)
            )));
            ray_1.origin = (tmpvar_20 - (tmpvar_13 * 0.001));
          } else {
            refractedRay_345.origin = (tmpvar_20 + ((tmpvar_13 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_13)
            )));
            refractedRay_345.dir = normalize(refractedRay_345.dir);
            if (!(tmpvar_124)) {
              ray_1 = refractedRay_345;
            } else {
              stack_7[stackSize_6].coeff = (coeff_4 * (vec3(1.0, 1.0, 1.0) - (tmpvar_125 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_125) * pow ((1.0 - abs(
                  dot (tmpvar_13, ray_1.dir)
                )), 5.0))
              )));
              stack_7[stackSize_6].depth = bounceCount_5;
              highp int tmpvar_362;
              tmpvar_362 = stackSize_6;
              stackSize_6++;
              stack_7[tmpvar_362].ray = refractedRay_345;
            };
          };
        };
        if ((((tmpvar_124 && 
          !(totalInternalReflection_344)
        ) && (tmpvar_18 != 3)) || tmpvar_343)) {
          lowp float tmpvar_363;
          tmpvar_363 = dot (ray_1.dir, tmpvar_13);
          if ((tmpvar_363 < 0.0)) {
            coeff_4 = (coeff_4 * (tmpvar_125 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_125)
             * 
              pow ((1.0 - abs(dot (tmpvar_13, ray_1.dir))), 5.0)
            )));
            vec3 I_364;
            I_364 = ray_1.dir;
            ray_1.dir = normalize((I_364 - (2.0 * 
              (dot (tmpvar_13, I_364) * tmpvar_13)
            )));
            ray_1.origin = (tmpvar_20 + (tmpvar_13 * 0.001));
          } else {
            continueLoop_3 = bool(0);
          };
        };
      } else {
        continueLoop_3 = bool(0);
      };
    } else {
      color_15 = (color_15 + (vec3(0.6, 0.75, 0.9) * coeff_4));
      continueLoop_3 = bool(0);
    };
    if (isGlowOn) {
      vec3 glowness_365;
      vec3 tmpvar_366;
      tmpvar_366 = normalize(ray_1.dir);
      vec3 tmpvar_367;
      tmpvar_367 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_366)
      ) * tmpvar_366));
      float tmpvar_368;
      tmpvar_368 = sqrt(dot (tmpvar_367, tmpvar_367));
      lowp float tmpvar_369;
      lowp vec3 x_370;
      x_370 = (tmpvar_20 - eye);
      tmpvar_369 = sqrt(dot (x_370, x_370));
      float tmpvar_371;
      vec3 x_372;
      x_372 = (spheres[0].xyz - eye);
      tmpvar_371 = sqrt(dot (x_372, x_372));
      if (((tmpvar_369 + spheres[0].w) < tmpvar_371)) {
        glowness_365 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_365 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_368 * tmpvar_368))
        ), 0.0, 1.0));
      };
      color_15 = (color_15 + glowness_365);
    };
    if ((!(continueLoop_3) && (stackSize_6 > 0))) {
      highp int tmpvar_373;
      tmpvar_373 = (stackSize_6 - 1);
      stackSize_6 = tmpvar_373;
      ray_1 = stack_7[tmpvar_373].ray;
      bounceCount_5 = stack_7[tmpvar_373].depth;
      coeff_4 = stack_7[tmpvar_373].coeff;
      continueLoop_3 = bool(1);
    };
    i_2++;
  };
  lowp vec4 tmpvar_374;
  tmpvar_374.w = 1.0;
  tmpvar_374.x = color_15[colorModeInTernary[0]];
  tmpvar_374.y = color_15[colorModeInTernary[1]];
  tmpvar_374.z = color_15[colorModeInTernary[2]];
  fragColor = tmpvar_374;
}