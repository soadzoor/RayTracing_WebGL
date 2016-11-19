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
    tmpvar_63 = bool(1);
    bool tmpvar_64;
    lowp float tmpvar_65;
    lowp vec3 tmpvar_66;
    bool tmpvar_67;
    lowp float tmpvar_68;
    tmpvar_68 = ((vec3(0.0, -10.0, 0.0) - tmpvar_16).y / tmpvar_17.y);
    if ((tmpvar_68 < 0.001)) {
      tmpvar_67 = bool(0);
    } else {
      tmpvar_65 = tmpvar_68;
      tmpvar_66 = (tmpvar_16 + (tmpvar_68 * tmpvar_17));
      tmpvar_67 = bool(1);
    };
    if (tmpvar_67) {
      lowp float tmpvar_69;
      lowp vec3 tmpvar_70;
      tmpvar_70 = ((tmpvar_16 + (tmpvar_65 * tmpvar_17)) - vec3(0.0, -10.0, 0.0));
      tmpvar_69 = sqrt(dot (tmpvar_70, tmpvar_70));
      if ((tmpvar_69 <= 30.0)) {
        tmpvar_64 = bool(1);
        tmpvar_63 = bool(0);
      };
    };
    if (tmpvar_63) {
      tmpvar_64 = bool(0);
      tmpvar_63 = bool(0);
    };
    if (tmpvar_64) {
      if (((tmpvar_65 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_65;
        tmpvar_18 = 12;
        tmpvar_19 = tmpvar_65;
        tmpvar_20 = tmpvar_66;
        tmpvar_21 = vec3(0.0, 1.0, 0.0);
        tmpvar_22 = vec3(0.0, -10.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_71;
    lowp vec3 tmpvar_72;
    bool tmpvar_73;
    lowp float tmpvar_74;
    tmpvar_74 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_16)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_17));
    if ((tmpvar_74 < 0.001)) {
      tmpvar_73 = bool(0);
    } else {
      tmpvar_71 = tmpvar_74;
      tmpvar_72 = (tmpvar_16 + (tmpvar_74 * tmpvar_17));
      tmpvar_73 = bool(1);
    };
    if (tmpvar_73) {
      if (((tmpvar_71 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_71;
        tmpvar_18 = 14;
        tmpvar_19 = tmpvar_71;
        tmpvar_20 = tmpvar_72;
        tmpvar_21 = vec3(0.0, 0.0, -1.0);
        tmpvar_22 = vec3(0.0, 0.0, 10000.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_75;
    lowp vec3 tmpvar_76;
    bool tmpvar_77;
    lowp float tmpvar_78;
    tmpvar_78 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_16).y / tmpvar_17.y);
    if ((tmpvar_78 < 0.001)) {
      tmpvar_77 = bool(0);
    } else {
      tmpvar_75 = tmpvar_78;
      tmpvar_76 = (tmpvar_16 + (tmpvar_78 * tmpvar_17));
      tmpvar_77 = bool(1);
    };
    if (tmpvar_77) {
      if (((tmpvar_75 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_75;
        tmpvar_18 = 15;
        tmpvar_19 = tmpvar_75;
        tmpvar_20 = tmpvar_76;
        tmpvar_21 = vec3(0.0, 1.0, 0.0);
        tmpvar_22 = vec3(0.0, -10000.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_79;
    lowp vec3 tmpvar_80;
    bool tmpvar_81;
    lowp float tmpvar_82;
    tmpvar_82 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_16).z / tmpvar_17.z);
    if ((tmpvar_82 < 0.001)) {
      tmpvar_81 = bool(0);
    } else {
      tmpvar_79 = tmpvar_82;
      tmpvar_80 = (tmpvar_16 + (tmpvar_82 * tmpvar_17));
      tmpvar_81 = bool(1);
    };
    if (tmpvar_81) {
      if (((tmpvar_79 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_79;
        tmpvar_18 = 16;
        tmpvar_19 = tmpvar_79;
        tmpvar_20 = tmpvar_80;
        tmpvar_21 = vec3(0.0, 0.0, 1.0);
        tmpvar_22 = vec3(0.0, 0.0, -10000.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_83;
    lowp vec3 tmpvar_84;
    bool tmpvar_85;
    lowp float tmpvar_86;
    tmpvar_86 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_16).x / tmpvar_17.x);
    if ((tmpvar_86 < 0.001)) {
      tmpvar_85 = bool(0);
    } else {
      tmpvar_83 = tmpvar_86;
      tmpvar_84 = (tmpvar_16 + (tmpvar_86 * tmpvar_17));
      tmpvar_85 = bool(1);
    };
    if (tmpvar_85) {
      if (((tmpvar_83 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_83;
        tmpvar_18 = 17;
        tmpvar_19 = tmpvar_83;
        tmpvar_20 = tmpvar_84;
        tmpvar_21 = vec3(1.0, 0.0, 0.0);
        tmpvar_22 = vec3(-10000.0, 0.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_87;
    lowp vec3 tmpvar_88;
    bool tmpvar_89;
    lowp float tmpvar_90;
    tmpvar_90 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_16)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_17));
    if ((tmpvar_90 < 0.001)) {
      tmpvar_89 = bool(0);
    } else {
      tmpvar_87 = tmpvar_90;
      tmpvar_88 = (tmpvar_16 + (tmpvar_90 * tmpvar_17));
      tmpvar_89 = bool(1);
    };
    if (tmpvar_89) {
      if (((tmpvar_87 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_87;
        tmpvar_18 = 18;
        tmpvar_19 = tmpvar_87;
        tmpvar_20 = tmpvar_88;
        tmpvar_21 = vec3(-1.0, 0.0, 0.0);
        tmpvar_22 = vec3(10000.0, 0.0, 0.0);
      };
      hit_24 = bool(1);
    };
    lowp float tmpvar_91;
    lowp vec3 tmpvar_92;
    bool tmpvar_93;
    lowp float tmpvar_94;
    tmpvar_94 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_16)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_17));
    if ((tmpvar_94 < 0.001)) {
      tmpvar_93 = bool(0);
    } else {
      tmpvar_91 = tmpvar_94;
      tmpvar_92 = (tmpvar_16 + (tmpvar_94 * tmpvar_17));
      tmpvar_93 = bool(1);
    };
    if (tmpvar_93) {
      if (((tmpvar_91 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_91;
        tmpvar_18 = 19;
        tmpvar_19 = tmpvar_91;
        tmpvar_20 = tmpvar_92;
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
      lowp float vec_y_95;
      vec_y_95 = -(tmpvar_21.z);
      lowp float vec_x_96;
      vec_x_96 = -(tmpvar_21.x);
      lowp float tmpvar_97;
      lowp float tmpvar_98;
      tmpvar_98 = (min (abs(
        (vec_y_95 / vec_x_96)
      ), 1.0) / max (abs(
        (vec_y_95 / vec_x_96)
      ), 1.0));
      lowp float tmpvar_99;
      tmpvar_99 = (tmpvar_98 * tmpvar_98);
      tmpvar_99 = (((
        ((((
          ((((-0.01213232 * tmpvar_99) + 0.05368138) * tmpvar_99) - 0.1173503)
         * tmpvar_99) + 0.1938925) * tmpvar_99) - 0.3326756)
       * tmpvar_99) + 0.9999793) * tmpvar_98);
      tmpvar_99 = (tmpvar_99 + (float(
        (abs((vec_y_95 / vec_x_96)) > 1.0)
      ) * (
        (tmpvar_99 * -2.0)
       + 1.570796)));
      tmpvar_97 = (tmpvar_99 * sign((vec_y_95 / vec_x_96)));
      if ((abs(vec_x_96) > (1e-08 * abs(vec_y_95)))) {
        if ((vec_x_96 < 0.0)) {
          if ((vec_y_95 >= 0.0)) {
            tmpvar_97 += 3.141593;
          } else {
            tmpvar_97 = (tmpvar_97 - 3.141593);
          };
        };
      } else {
        tmpvar_97 = (sign(vec_y_95) * 1.570796);
      };
      u_9 = (0.5 - (tmpvar_97 / 6.283185));
      lowp float x_100;
      x_100 = -(tmpvar_21.y);
      v_8 = (0.5 + ((
        sign(x_100)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_100)
        )) * (1.570796 + (
          abs(x_100)
         * 
          (-0.2146018 + (abs(x_100) * (0.08656672 + (
            abs(x_100)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_18 == 3)) {
          lowp vec3 normalFromMap_101;
          u_9 = (u_9 + (time / 2.0));
          lowp vec2 tmpvar_102;
          tmpvar_102.x = u_9;
          tmpvar_102.y = v_8;
          normalFromMap_101 = normalize(((2.0 * texture (earthNormalMap, tmpvar_102).xyz) - 1.0));
          lowp mat3 tmpvar_103;
          lowp float tmpvar_104;
          tmpvar_104 = (1.570796 - (sign(tmpvar_21.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_21.z))) * (1.570796 + (abs(tmpvar_21.z) * (-0.2146018 + 
              (abs(tmpvar_21.z) * (0.08656672 + (abs(tmpvar_21.z) * -0.03102955)))
            ))))
          )));
          lowp vec3 tmpvar_105;
          tmpvar_105 = ((tmpvar_21.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_21.zxy * vec3(0.0, 1.0, 0.0)));
          lowp float tmpvar_106;
          tmpvar_106 = sqrt(dot (tmpvar_105, tmpvar_105));
          if ((tmpvar_106 < 0.001)) {
            tmpvar_103 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            lowp vec3 tmpvar_107;
            tmpvar_107 = normalize(tmpvar_105);
            lowp float tmpvar_108;
            tmpvar_108 = sin(tmpvar_104);
            lowp float tmpvar_109;
            tmpvar_109 = cos(tmpvar_104);
            lowp float tmpvar_110;
            tmpvar_110 = (1.0 - tmpvar_109);
            lowp mat3 tmpvar_111;
            tmpvar_111[uint(0)].x = (((tmpvar_110 * tmpvar_107.x) * tmpvar_107.x) + tmpvar_109);
            tmpvar_111[uint(0)].y = (((tmpvar_110 * tmpvar_107.x) * tmpvar_107.y) - (tmpvar_107.z * tmpvar_108));
            tmpvar_111[uint(0)].z = (((tmpvar_110 * tmpvar_107.z) * tmpvar_107.x) + (tmpvar_107.y * tmpvar_108));
            tmpvar_111[1u].x = (((tmpvar_110 * tmpvar_107.x) * tmpvar_107.y) + (tmpvar_107.z * tmpvar_108));
            tmpvar_111[1u].y = (((tmpvar_110 * tmpvar_107.y) * tmpvar_107.y) + tmpvar_109);
            tmpvar_111[1u].z = (((tmpvar_110 * tmpvar_107.y) * tmpvar_107.z) - (tmpvar_107.x * tmpvar_108));
            tmpvar_111[2u].x = (((tmpvar_110 * tmpvar_107.z) * tmpvar_107.x) - (tmpvar_107.y * tmpvar_108));
            tmpvar_111[2u].y = (((tmpvar_110 * tmpvar_107.y) * tmpvar_107.z) + (tmpvar_107.x * tmpvar_108));
            tmpvar_111[2u].z = (((tmpvar_110 * tmpvar_107.z) * tmpvar_107.z) + tmpvar_109);
            tmpvar_103 = tmpvar_111;
          };
          tmpvar_13 = (tmpvar_103 * normalFromMap_101);
        } else {
          if ((tmpvar_18 == 4)) {
            lowp vec3 normalFromMap_112;
            u_9 = (u_9 + (time / 7.0));
            lowp vec2 tmpvar_113;
            tmpvar_113.x = u_9;
            tmpvar_113.y = v_8;
            normalFromMap_112 = normalize(((2.0 * texture (moonNormalMap, tmpvar_113).xyz) - 1.0));
            lowp mat3 tmpvar_114;
            lowp float tmpvar_115;
            tmpvar_115 = (1.570796 - (sign(tmpvar_13.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_13.z))) * (1.570796 + (abs(tmpvar_13.z) * (-0.2146018 + 
                (abs(tmpvar_13.z) * (0.08656672 + (abs(tmpvar_13.z) * -0.03102955)))
              ))))
            )));
            lowp vec3 tmpvar_116;
            tmpvar_116 = ((tmpvar_13.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_13.zxy * vec3(0.0, 1.0, 0.0)));
            lowp float tmpvar_117;
            tmpvar_117 = sqrt(dot (tmpvar_116, tmpvar_116));
            if ((tmpvar_117 < 0.001)) {
              tmpvar_114 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              lowp vec3 tmpvar_118;
              tmpvar_118 = normalize(tmpvar_116);
              lowp float tmpvar_119;
              tmpvar_119 = sin(tmpvar_115);
              lowp float tmpvar_120;
              tmpvar_120 = cos(tmpvar_115);
              lowp float tmpvar_121;
              tmpvar_121 = (1.0 - tmpvar_120);
              lowp mat3 tmpvar_122;
              tmpvar_122[uint(0)].x = (((tmpvar_121 * tmpvar_118.x) * tmpvar_118.x) + tmpvar_120);
              tmpvar_122[uint(0)].y = (((tmpvar_121 * tmpvar_118.x) * tmpvar_118.y) - (tmpvar_118.z * tmpvar_119));
              tmpvar_122[uint(0)].z = (((tmpvar_121 * tmpvar_118.z) * tmpvar_118.x) + (tmpvar_118.y * tmpvar_119));
              tmpvar_122[1u].x = (((tmpvar_121 * tmpvar_118.x) * tmpvar_118.y) + (tmpvar_118.z * tmpvar_119));
              tmpvar_122[1u].y = (((tmpvar_121 * tmpvar_118.y) * tmpvar_118.y) + tmpvar_120);
              tmpvar_122[1u].z = (((tmpvar_121 * tmpvar_118.y) * tmpvar_118.z) - (tmpvar_118.x * tmpvar_119));
              tmpvar_122[2u].x = (((tmpvar_121 * tmpvar_118.z) * tmpvar_118.x) - (tmpvar_118.y * tmpvar_119));
              tmpvar_122[2u].y = (((tmpvar_121 * tmpvar_118.y) * tmpvar_118.z) + (tmpvar_118.x * tmpvar_119));
              tmpvar_122[2u].z = (((tmpvar_121 * tmpvar_118.z) * tmpvar_118.z) + tmpvar_120);
              tmpvar_114 = tmpvar_122;
            };
            tmpvar_13 = (tmpvar_114 * normalFromMap_112);
          };
        };
      };
      bounceCount_5++;
      lowp vec3 tmpvar_123;
      bool tmpvar_124;
      bool tmpvar_125;
      vec3 tmpvar_126;
      float tmpvar_127;
      Material tmpvar_128;
      if ((tmpvar_18 == 0)) {
        tmpvar_128 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_18 == 1)) {
          tmpvar_128 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 2)) {
            tmpvar_128 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 3)) {
              tmpvar_128 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 4)) {
                tmpvar_128 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 5)) {
                  tmpvar_128 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 6)) {
                    tmpvar_128 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 7)) {
                      tmpvar_128 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 8)) {
                        tmpvar_128 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_18 == 9)) {
                          tmpvar_128 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                            tmpvar_128 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                              tmpvar_128 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if ((tmpvar_18 == 12)) {
                                tmpvar_128 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_18 > 13)) {
                                  tmpvar_128 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  tmpvar_128 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
      tmpvar_123 = tmpvar_128.amb;
      tmpvar_124 = tmpvar_128.refractive;
      tmpvar_125 = tmpvar_128.reflective;
      tmpvar_126 = tmpvar_128.f0;
      tmpvar_127 = tmpvar_128.n;
      lowp vec3 tmpvar_129;
      if ((tmpvar_18 == 0)) {
        tmpvar_129 = tmpvar_123;
      } else {
        lowp float diffintensity_130;
        lowp vec3 toLight_131;
        lowp vec3 specular_132;
        lowp vec3 diffuse_133;
        lowp vec3 color_134;
        lowp vec3 refDir_135;
        lowp vec3 I_136;
        I_136 = (tmpvar_20 - ray_1.origin);
        refDir_135 = normalize((I_136 - (2.0 * 
          (dot (tmpvar_13, I_136) * tmpvar_13)
        )));
        lowp vec3 tmpvar_137;
        Material tmpvar_138;
        if ((tmpvar_18 == 0)) {
          tmpvar_138 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_138 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_138 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_138 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_138 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_138 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_138 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_138 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_138 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_138 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_138 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_138 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_138 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_138 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_138 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        tmpvar_137 = tmpvar_138.amb;
        color_134 = tmpvar_137;
        diffuse_133 = vec3(0.0, 0.0, 0.0);
        specular_132 = vec3(0.0, 0.0, 0.0);
        lowp vec3 tmpvar_139;
        tmpvar_139 = normalize(-(tmpvar_20));
        toLight_131 = tmpvar_139;
        diffintensity_130 = clamp (dot (tmpvar_13, tmpvar_139), 0.0, 1.0);
        vec3 tmpvar_140;
        Material tmpvar_141;
        if ((tmpvar_18 == 0)) {
          tmpvar_141 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_141 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_141 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_141 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_141 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_141 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        tmpvar_140 = tmpvar_141.spec;
        lowp float tmpvar_142;
        tmpvar_142 = clamp (dot (tmpvar_139, refDir_135), 0.0, 1.0);
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
                                  tmpvar_143 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        specular_132 = clamp ((tmpvar_140 * pow (tmpvar_142, tmpvar_143.pow)), 0.0, 1.0);
        Material tmpvar_144;
        if ((tmpvar_18 == 0)) {
          tmpvar_144 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_144 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_144 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_144 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_144 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_144 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_144 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_144 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_144 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_144 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_144 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_144 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_144 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_144 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_144 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        diffuse_133 = clamp ((tmpvar_144.dif * diffintensity_130), 0.0, 1.0);
        if (isShadowOn) {
          lowp vec3 tmpvar_145;
          lowp vec3 tmpvar_146;
          tmpvar_145 = (tmpvar_20 + (tmpvar_13 * 0.001));
          tmpvar_146 = normalize(-(tmpvar_20));
          highp int tmpvar_147;
          tmpvar_147 = tmpvar_18;
          highp int i_148;
          lowp float minT_149;
          minT_149 = -1.0;
          i_148 = 0;
          while (true) {
            if ((i_148 >= 10)) {
              break;
            };
            vec4 sphere_150;
            sphere_150 = spheres[i_148];
            highp int tmpvar_151;
            lowp float tmpvar_152;
            bool tmpvar_153;
            lowp float t_154;
            lowp float t2_155;
            lowp float t1_156;
            lowp vec3 tmpvar_157;
            tmpvar_157 = (tmpvar_145 - sphere_150.xyz);
            lowp float tmpvar_158;
            tmpvar_158 = (dot (tmpvar_157, tmpvar_146) * 2.0);
            lowp float tmpvar_159;
            tmpvar_159 = dot (tmpvar_146, tmpvar_146);
            lowp float tmpvar_160;
            tmpvar_160 = ((tmpvar_158 * tmpvar_158) - ((4.0 * tmpvar_159) * (
              dot (tmpvar_157, tmpvar_157)
             - 
              (sphere_150.w * sphere_150.w)
            )));
            if ((tmpvar_160 < 0.0)) {
              tmpvar_153 = bool(0);
            } else {
              lowp float tmpvar_161;
              tmpvar_161 = sqrt(tmpvar_160);
              lowp float tmpvar_162;
              tmpvar_162 = (((
                -(tmpvar_158)
               + tmpvar_161) / 2.0) / tmpvar_159);
              t1_156 = tmpvar_162;
              lowp float tmpvar_163;
              tmpvar_163 = (((
                -(tmpvar_158)
               - tmpvar_161) / 2.0) / tmpvar_159);
              t2_155 = tmpvar_163;
              if ((tmpvar_162 < 0.001)) {
                t1_156 = -0.001;
              };
              if ((tmpvar_163 < 0.001)) {
                t2_155 = -0.001;
              };
              if ((t1_156 < 0.0)) {
                tmpvar_153 = bool(0);
              } else {
                if ((t2_155 > 0.0)) {
                  t_154 = t2_155;
                } else {
                  t_154 = t1_156;
                };
                tmpvar_151 = i_148;
                tmpvar_152 = t_154;
                tmpvar_153 = bool(1);
              };
            };
            if ((tmpvar_153 && ((tmpvar_152 < minT_149) || (minT_149 < 0.0)))) {
              minT_149 = tmpvar_152;
              tmpvar_147 = tmpvar_151;
            };
            i_148++;
          };
          lowp float tmpvar_164;
          bool tmpvar_165;
          lowp float t1_166;
          lowp float v_167;
          lowp float u_168;
          lowp float invDet_169;
          lowp vec3 T_170;
          lowp vec3 tmpvar_171;
          tmpvar_171 = ((tmpvar_146.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_146.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_169 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_171)));
          T_170 = (tmpvar_145 - vec3(-14.0, 14.0, -14.0));
          u_168 = (dot (T_170, tmpvar_171) * invDet_169);
          if (((u_168 < 0.0) || (u_168 > 1.0))) {
            tmpvar_165 = bool(0);
          } else {
            lowp vec3 tmpvar_172;
            tmpvar_172 = ((T_170.yzx * vec3(2.0, 0.0, -19.0)) - (T_170.zxy * vec3(-19.0, 2.0, 0.0)));
            v_167 = (dot (tmpvar_146, tmpvar_172) * invDet_169);
            if (((v_167 < 0.0) || ((u_168 + v_167) > 1.0))) {
              tmpvar_165 = bool(0);
            } else {
              t1_166 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_172) * invDet_169);
              if ((t1_166 > 0.001)) {
                tmpvar_164 = t1_166;
                tmpvar_165 = bool(1);
              } else {
                tmpvar_165 = bool(0);
              };
            };
          };
          if ((tmpvar_165 && ((tmpvar_164 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_164;
            tmpvar_147 = 10;
          };
          lowp float tmpvar_173;
          bool tmpvar_174;
          lowp float t1_175;
          lowp float v_176;
          lowp float u_177;
          lowp float invDet_178;
          lowp vec3 T_179;
          lowp vec3 tmpvar_180;
          tmpvar_180 = ((tmpvar_146.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_146.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_178 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_180)));
          T_179 = (tmpvar_145 - vec3(-14.0, 14.0, -14.0));
          u_177 = (dot (T_179, tmpvar_180) * invDet_178);
          if (((u_177 < 0.0) || (u_177 > 1.0))) {
            tmpvar_174 = bool(0);
          } else {
            lowp vec3 tmpvar_181;
            tmpvar_181 = ((T_179.yzx * vec3(2.0, 28.0, -19.0)) - (T_179.zxy * vec3(-19.0, 2.0, 28.0)));
            v_176 = (dot (tmpvar_146, tmpvar_181) * invDet_178);
            if (((v_176 < 0.0) || ((u_177 + v_176) > 1.0))) {
              tmpvar_174 = bool(0);
            } else {
              t1_175 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_181) * invDet_178);
              if ((t1_175 > 0.001)) {
                tmpvar_173 = t1_175;
                tmpvar_174 = bool(1);
              } else {
                tmpvar_174 = bool(0);
              };
            };
          };
          if ((tmpvar_174 && ((tmpvar_173 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_173;
            tmpvar_147 = 11;
          };
          bool tmpvar_182;
          tmpvar_182 = bool(1);
          bool tmpvar_183;
          lowp float tmpvar_184;
          bool tmpvar_185;
          lowp float tmpvar_186;
          tmpvar_186 = ((vec3(0.0, -10.0, 0.0) - tmpvar_145).y / tmpvar_146.y);
          if ((tmpvar_186 < 0.001)) {
            tmpvar_185 = bool(0);
          } else {
            tmpvar_184 = tmpvar_186;
            tmpvar_185 = bool(1);
          };
          if (tmpvar_185) {
            lowp float tmpvar_187;
            lowp vec3 tmpvar_188;
            tmpvar_188 = ((tmpvar_145 + (tmpvar_184 * tmpvar_146)) - vec3(0.0, -10.0, 0.0));
            tmpvar_187 = sqrt(dot (tmpvar_188, tmpvar_188));
            if ((tmpvar_187 <= 30.0)) {
              tmpvar_183 = bool(1);
              tmpvar_182 = bool(0);
            };
          };
          if (tmpvar_182) {
            tmpvar_183 = bool(0);
            tmpvar_182 = bool(0);
          };
          if ((tmpvar_183 && ((tmpvar_184 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_184;
            tmpvar_147 = 12;
          };
          lowp float tmpvar_189;
          bool tmpvar_190;
          lowp float tmpvar_191;
          tmpvar_191 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_145)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_146));
          if ((tmpvar_191 < 0.001)) {
            tmpvar_190 = bool(0);
          } else {
            tmpvar_189 = tmpvar_191;
            tmpvar_190 = bool(1);
          };
          if ((tmpvar_190 && ((tmpvar_189 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_189;
            tmpvar_147 = 14;
          };
          lowp float tmpvar_192;
          bool tmpvar_193;
          lowp float tmpvar_194;
          tmpvar_194 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_145).y / tmpvar_146.y);
          if ((tmpvar_194 < 0.001)) {
            tmpvar_193 = bool(0);
          } else {
            tmpvar_192 = tmpvar_194;
            tmpvar_193 = bool(1);
          };
          if ((tmpvar_193 && ((tmpvar_192 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_192;
            tmpvar_147 = 15;
          };
          lowp float tmpvar_195;
          bool tmpvar_196;
          lowp float tmpvar_197;
          tmpvar_197 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_145).z / tmpvar_146.z);
          if ((tmpvar_197 < 0.001)) {
            tmpvar_196 = bool(0);
          } else {
            tmpvar_195 = tmpvar_197;
            tmpvar_196 = bool(1);
          };
          if ((tmpvar_196 && ((tmpvar_195 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_195;
            tmpvar_147 = 16;
          };
          lowp float tmpvar_198;
          bool tmpvar_199;
          lowp float tmpvar_200;
          tmpvar_200 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_145).x / tmpvar_146.x);
          if ((tmpvar_200 < 0.001)) {
            tmpvar_199 = bool(0);
          } else {
            tmpvar_198 = tmpvar_200;
            tmpvar_199 = bool(1);
          };
          if ((tmpvar_199 && ((tmpvar_198 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_198;
            tmpvar_147 = 17;
          };
          lowp float tmpvar_201;
          bool tmpvar_202;
          lowp float tmpvar_203;
          tmpvar_203 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_145)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_146));
          if ((tmpvar_203 < 0.001)) {
            tmpvar_202 = bool(0);
          } else {
            tmpvar_201 = tmpvar_203;
            tmpvar_202 = bool(1);
          };
          if ((tmpvar_202 && ((tmpvar_201 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_201;
            tmpvar_147 = 18;
          };
          lowp float tmpvar_204;
          bool tmpvar_205;
          lowp float tmpvar_206;
          tmpvar_206 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_145)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_146));
          if ((tmpvar_206 < 0.001)) {
            tmpvar_205 = bool(0);
          } else {
            tmpvar_204 = tmpvar_206;
            tmpvar_205 = bool(1);
          };
          if ((tmpvar_205 && ((tmpvar_204 < minT_149) || (minT_149 < 0.0)))) {
            minT_149 = tmpvar_204;
            tmpvar_147 = 19;
          };
          if ((((
            (((tmpvar_147 != 0) && (tmpvar_147 != 5)) && (tmpvar_147 != 6))
           && 
            (tmpvar_147 != 12)
          ) && (tmpvar_147 != tmpvar_18)) && (tmpvar_18 <= 12))) {
            specular_132 = vec3(0.0, 0.0, 0.0);
            diffuse_133 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_134 = (tmpvar_137 + (diffuse_133 + specular_132));
        toLight_131 = (vec3(-2.0, 20.0, 0.0) - tmpvar_20);
        lowp vec3 tmpvar_207;
        tmpvar_207 = normalize(toLight_131);
        toLight_131 = tmpvar_207;
        diffintensity_130 = clamp (dot (tmpvar_13, tmpvar_207), 0.0, 1.0);
        vec3 tmpvar_208;
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
                                  tmpvar_209 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        tmpvar_208 = tmpvar_209.spec;
        lowp float tmpvar_210;
        tmpvar_210 = clamp (dot (tmpvar_207, refDir_135), 0.0, 1.0);
        Material tmpvar_211;
        if ((tmpvar_18 == 0)) {
          tmpvar_211 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_211 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_211 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_211 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_211 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_211 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        specular_132 = clamp ((tmpvar_208 * pow (tmpvar_210, tmpvar_211.pow)), 0.0, 1.0);
        Material tmpvar_212;
        if ((tmpvar_18 == 0)) {
          tmpvar_212 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_212 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_212 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_212 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_212 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_212 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        diffuse_133 = clamp ((tmpvar_212.dif * diffintensity_130), 0.0, 1.0);
        if (isShadowOn) {
          lowp vec3 tmpvar_213;
          lowp vec3 tmpvar_214;
          tmpvar_213 = (tmpvar_20 + (tmpvar_13 * 0.001));
          tmpvar_214 = normalize((vec3(-2.0, 20.0, 0.0) - tmpvar_20));
          highp int tmpvar_215;
          tmpvar_215 = tmpvar_18;
          highp int i_216;
          lowp float minT_217;
          minT_217 = -1.0;
          i_216 = 0;
          while (true) {
            if ((i_216 >= 10)) {
              break;
            };
            vec4 sphere_218;
            sphere_218 = spheres[i_216];
            highp int tmpvar_219;
            lowp float tmpvar_220;
            bool tmpvar_221;
            lowp float t_222;
            lowp float t2_223;
            lowp float t1_224;
            lowp vec3 tmpvar_225;
            tmpvar_225 = (tmpvar_213 - sphere_218.xyz);
            lowp float tmpvar_226;
            tmpvar_226 = (dot (tmpvar_225, tmpvar_214) * 2.0);
            lowp float tmpvar_227;
            tmpvar_227 = dot (tmpvar_214, tmpvar_214);
            lowp float tmpvar_228;
            tmpvar_228 = ((tmpvar_226 * tmpvar_226) - ((4.0 * tmpvar_227) * (
              dot (tmpvar_225, tmpvar_225)
             - 
              (sphere_218.w * sphere_218.w)
            )));
            if ((tmpvar_228 < 0.0)) {
              tmpvar_221 = bool(0);
            } else {
              lowp float tmpvar_229;
              tmpvar_229 = sqrt(tmpvar_228);
              lowp float tmpvar_230;
              tmpvar_230 = (((
                -(tmpvar_226)
               + tmpvar_229) / 2.0) / tmpvar_227);
              t1_224 = tmpvar_230;
              lowp float tmpvar_231;
              tmpvar_231 = (((
                -(tmpvar_226)
               - tmpvar_229) / 2.0) / tmpvar_227);
              t2_223 = tmpvar_231;
              if ((tmpvar_230 < 0.001)) {
                t1_224 = -0.001;
              };
              if ((tmpvar_231 < 0.001)) {
                t2_223 = -0.001;
              };
              if ((t1_224 < 0.0)) {
                tmpvar_221 = bool(0);
              } else {
                if ((t2_223 > 0.0)) {
                  t_222 = t2_223;
                } else {
                  t_222 = t1_224;
                };
                tmpvar_219 = i_216;
                tmpvar_220 = t_222;
                tmpvar_221 = bool(1);
              };
            };
            if ((tmpvar_221 && ((tmpvar_220 < minT_217) || (minT_217 < 0.0)))) {
              minT_217 = tmpvar_220;
              tmpvar_215 = tmpvar_219;
            };
            i_216++;
          };
          lowp float tmpvar_232;
          bool tmpvar_233;
          lowp float t1_234;
          lowp float v_235;
          lowp float u_236;
          lowp float invDet_237;
          lowp vec3 T_238;
          lowp vec3 tmpvar_239;
          tmpvar_239 = ((tmpvar_214.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_214.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_237 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_239)));
          T_238 = (tmpvar_213 - vec3(-14.0, 14.0, -14.0));
          u_236 = (dot (T_238, tmpvar_239) * invDet_237);
          if (((u_236 < 0.0) || (u_236 > 1.0))) {
            tmpvar_233 = bool(0);
          } else {
            lowp vec3 tmpvar_240;
            tmpvar_240 = ((T_238.yzx * vec3(2.0, 0.0, -19.0)) - (T_238.zxy * vec3(-19.0, 2.0, 0.0)));
            v_235 = (dot (tmpvar_214, tmpvar_240) * invDet_237);
            if (((v_235 < 0.0) || ((u_236 + v_235) > 1.0))) {
              tmpvar_233 = bool(0);
            } else {
              t1_234 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_240) * invDet_237);
              if ((t1_234 > 0.001)) {
                tmpvar_232 = t1_234;
                tmpvar_233 = bool(1);
              } else {
                tmpvar_233 = bool(0);
              };
            };
          };
          if ((tmpvar_233 && ((tmpvar_232 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_232;
            tmpvar_215 = 10;
          };
          lowp float tmpvar_241;
          bool tmpvar_242;
          lowp float t1_243;
          lowp float v_244;
          lowp float u_245;
          lowp float invDet_246;
          lowp vec3 T_247;
          lowp vec3 tmpvar_248;
          tmpvar_248 = ((tmpvar_214.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_214.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_246 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_248)));
          T_247 = (tmpvar_213 - vec3(-14.0, 14.0, -14.0));
          u_245 = (dot (T_247, tmpvar_248) * invDet_246);
          if (((u_245 < 0.0) || (u_245 > 1.0))) {
            tmpvar_242 = bool(0);
          } else {
            lowp vec3 tmpvar_249;
            tmpvar_249 = ((T_247.yzx * vec3(2.0, 28.0, -19.0)) - (T_247.zxy * vec3(-19.0, 2.0, 28.0)));
            v_244 = (dot (tmpvar_214, tmpvar_249) * invDet_246);
            if (((v_244 < 0.0) || ((u_245 + v_244) > 1.0))) {
              tmpvar_242 = bool(0);
            } else {
              t1_243 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_249) * invDet_246);
              if ((t1_243 > 0.001)) {
                tmpvar_241 = t1_243;
                tmpvar_242 = bool(1);
              } else {
                tmpvar_242 = bool(0);
              };
            };
          };
          if ((tmpvar_242 && ((tmpvar_241 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_241;
            tmpvar_215 = 11;
          };
          bool tmpvar_250;
          tmpvar_250 = bool(1);
          bool tmpvar_251;
          lowp float tmpvar_252;
          bool tmpvar_253;
          lowp float tmpvar_254;
          tmpvar_254 = ((vec3(0.0, -10.0, 0.0) - tmpvar_213).y / tmpvar_214.y);
          if ((tmpvar_254 < 0.001)) {
            tmpvar_253 = bool(0);
          } else {
            tmpvar_252 = tmpvar_254;
            tmpvar_253 = bool(1);
          };
          if (tmpvar_253) {
            lowp float tmpvar_255;
            lowp vec3 tmpvar_256;
            tmpvar_256 = ((tmpvar_213 + (tmpvar_252 * tmpvar_214)) - vec3(0.0, -10.0, 0.0));
            tmpvar_255 = sqrt(dot (tmpvar_256, tmpvar_256));
            if ((tmpvar_255 <= 30.0)) {
              tmpvar_251 = bool(1);
              tmpvar_250 = bool(0);
            };
          };
          if (tmpvar_250) {
            tmpvar_251 = bool(0);
            tmpvar_250 = bool(0);
          };
          if ((tmpvar_251 && ((tmpvar_252 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_252;
            tmpvar_215 = 12;
          };
          lowp float tmpvar_257;
          bool tmpvar_258;
          lowp float tmpvar_259;
          tmpvar_259 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_213)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_214));
          if ((tmpvar_259 < 0.001)) {
            tmpvar_258 = bool(0);
          } else {
            tmpvar_257 = tmpvar_259;
            tmpvar_258 = bool(1);
          };
          if ((tmpvar_258 && ((tmpvar_257 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_257;
            tmpvar_215 = 14;
          };
          lowp float tmpvar_260;
          bool tmpvar_261;
          lowp float tmpvar_262;
          tmpvar_262 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_213).y / tmpvar_214.y);
          if ((tmpvar_262 < 0.001)) {
            tmpvar_261 = bool(0);
          } else {
            tmpvar_260 = tmpvar_262;
            tmpvar_261 = bool(1);
          };
          if ((tmpvar_261 && ((tmpvar_260 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_260;
            tmpvar_215 = 15;
          };
          lowp float tmpvar_263;
          bool tmpvar_264;
          lowp float tmpvar_265;
          tmpvar_265 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_213).z / tmpvar_214.z);
          if ((tmpvar_265 < 0.001)) {
            tmpvar_264 = bool(0);
          } else {
            tmpvar_263 = tmpvar_265;
            tmpvar_264 = bool(1);
          };
          if ((tmpvar_264 && ((tmpvar_263 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_263;
            tmpvar_215 = 16;
          };
          lowp float tmpvar_266;
          bool tmpvar_267;
          lowp float tmpvar_268;
          tmpvar_268 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_213).x / tmpvar_214.x);
          if ((tmpvar_268 < 0.001)) {
            tmpvar_267 = bool(0);
          } else {
            tmpvar_266 = tmpvar_268;
            tmpvar_267 = bool(1);
          };
          if ((tmpvar_267 && ((tmpvar_266 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_266;
            tmpvar_215 = 17;
          };
          lowp float tmpvar_269;
          bool tmpvar_270;
          lowp float tmpvar_271;
          tmpvar_271 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_213)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_214));
          if ((tmpvar_271 < 0.001)) {
            tmpvar_270 = bool(0);
          } else {
            tmpvar_269 = tmpvar_271;
            tmpvar_270 = bool(1);
          };
          if ((tmpvar_270 && ((tmpvar_269 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_269;
            tmpvar_215 = 18;
          };
          lowp float tmpvar_272;
          bool tmpvar_273;
          lowp float tmpvar_274;
          tmpvar_274 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_213)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_214));
          if ((tmpvar_274 < 0.001)) {
            tmpvar_273 = bool(0);
          } else {
            tmpvar_272 = tmpvar_274;
            tmpvar_273 = bool(1);
          };
          if ((tmpvar_273 && ((tmpvar_272 < minT_217) || (minT_217 < 0.0)))) {
            minT_217 = tmpvar_272;
            tmpvar_215 = 19;
          };
          if ((((
            (((tmpvar_215 != 0) && (tmpvar_215 != 5)) && (tmpvar_215 != 6))
           && 
            (tmpvar_215 != 12)
          ) && (tmpvar_215 != tmpvar_18)) && (tmpvar_18 <= 12))) {
            specular_132 = vec3(0.0, 0.0, 0.0);
            diffuse_133 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_134 = (color_134 + (diffuse_133 + specular_132));
        toLight_131 = (vec3(20.0, 20.0, 0.0) - tmpvar_20);
        lowp vec3 tmpvar_275;
        tmpvar_275 = normalize(toLight_131);
        toLight_131 = tmpvar_275;
        diffintensity_130 = clamp (dot (tmpvar_13, tmpvar_275), 0.0, 1.0);
        vec3 tmpvar_276;
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
                                  tmpvar_277 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        tmpvar_276 = tmpvar_277.spec;
        lowp float tmpvar_278;
        tmpvar_278 = clamp (dot (tmpvar_275, refDir_135), 0.0, 1.0);
        Material tmpvar_279;
        if ((tmpvar_18 == 0)) {
          tmpvar_279 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_279 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_279 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_279 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_279 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_279 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        specular_132 = clamp ((tmpvar_276 * pow (tmpvar_278, tmpvar_279.pow)), 0.0, 1.0);
        Material tmpvar_280;
        if ((tmpvar_18 == 0)) {
          tmpvar_280 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_280 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_280 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_280 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_280 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 5)) {
                    tmpvar_280 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 6)) {
                      tmpvar_280 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 7)) {
                        tmpvar_280 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_18 == 8)) {
                          tmpvar_280 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_18 == 9)) {
                            tmpvar_280 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_18 >= 10) && (tmpvar_18 < 10))) {
                              tmpvar_280 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 == 10) || (tmpvar_18 == 11))) {
                                tmpvar_280 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_18 == 12)) {
                                  tmpvar_280 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 13)) {
                                    tmpvar_280 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_280 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        diffuse_133 = clamp ((tmpvar_280.dif * diffintensity_130), 0.0, 1.0);
        if (isShadowOn) {
          lowp vec3 tmpvar_281;
          lowp vec3 tmpvar_282;
          tmpvar_281 = (tmpvar_20 + (tmpvar_13 * 0.001));
          tmpvar_282 = normalize((vec3(20.0, 20.0, 0.0) - tmpvar_20));
          highp int tmpvar_283;
          tmpvar_283 = tmpvar_18;
          highp int i_284;
          lowp float minT_285;
          minT_285 = -1.0;
          i_284 = 0;
          while (true) {
            if ((i_284 >= 10)) {
              break;
            };
            vec4 sphere_286;
            sphere_286 = spheres[i_284];
            highp int tmpvar_287;
            lowp float tmpvar_288;
            bool tmpvar_289;
            lowp float t_290;
            lowp float t2_291;
            lowp float t1_292;
            lowp vec3 tmpvar_293;
            tmpvar_293 = (tmpvar_281 - sphere_286.xyz);
            lowp float tmpvar_294;
            tmpvar_294 = (dot (tmpvar_293, tmpvar_282) * 2.0);
            lowp float tmpvar_295;
            tmpvar_295 = dot (tmpvar_282, tmpvar_282);
            lowp float tmpvar_296;
            tmpvar_296 = ((tmpvar_294 * tmpvar_294) - ((4.0 * tmpvar_295) * (
              dot (tmpvar_293, tmpvar_293)
             - 
              (sphere_286.w * sphere_286.w)
            )));
            if ((tmpvar_296 < 0.0)) {
              tmpvar_289 = bool(0);
            } else {
              lowp float tmpvar_297;
              tmpvar_297 = sqrt(tmpvar_296);
              lowp float tmpvar_298;
              tmpvar_298 = (((
                -(tmpvar_294)
               + tmpvar_297) / 2.0) / tmpvar_295);
              t1_292 = tmpvar_298;
              lowp float tmpvar_299;
              tmpvar_299 = (((
                -(tmpvar_294)
               - tmpvar_297) / 2.0) / tmpvar_295);
              t2_291 = tmpvar_299;
              if ((tmpvar_298 < 0.001)) {
                t1_292 = -0.001;
              };
              if ((tmpvar_299 < 0.001)) {
                t2_291 = -0.001;
              };
              if ((t1_292 < 0.0)) {
                tmpvar_289 = bool(0);
              } else {
                if ((t2_291 > 0.0)) {
                  t_290 = t2_291;
                } else {
                  t_290 = t1_292;
                };
                tmpvar_287 = i_284;
                tmpvar_288 = t_290;
                tmpvar_289 = bool(1);
              };
            };
            if ((tmpvar_289 && ((tmpvar_288 < minT_285) || (minT_285 < 0.0)))) {
              minT_285 = tmpvar_288;
              tmpvar_283 = tmpvar_287;
            };
            i_284++;
          };
          lowp float tmpvar_300;
          bool tmpvar_301;
          lowp float t1_302;
          lowp float v_303;
          lowp float u_304;
          lowp float invDet_305;
          lowp vec3 T_306;
          lowp vec3 tmpvar_307;
          tmpvar_307 = ((tmpvar_282.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_282.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_305 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_307)));
          T_306 = (tmpvar_281 - vec3(-14.0, 14.0, -14.0));
          u_304 = (dot (T_306, tmpvar_307) * invDet_305);
          if (((u_304 < 0.0) || (u_304 > 1.0))) {
            tmpvar_301 = bool(0);
          } else {
            lowp vec3 tmpvar_308;
            tmpvar_308 = ((T_306.yzx * vec3(2.0, 0.0, -19.0)) - (T_306.zxy * vec3(-19.0, 2.0, 0.0)));
            v_303 = (dot (tmpvar_282, tmpvar_308) * invDet_305);
            if (((v_303 < 0.0) || ((u_304 + v_303) > 1.0))) {
              tmpvar_301 = bool(0);
            } else {
              t1_302 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_308) * invDet_305);
              if ((t1_302 > 0.001)) {
                tmpvar_300 = t1_302;
                tmpvar_301 = bool(1);
              } else {
                tmpvar_301 = bool(0);
              };
            };
          };
          if ((tmpvar_301 && ((tmpvar_300 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_300;
            tmpvar_283 = 10;
          };
          lowp float tmpvar_309;
          bool tmpvar_310;
          lowp float t1_311;
          lowp float v_312;
          lowp float u_313;
          lowp float invDet_314;
          lowp vec3 T_315;
          lowp vec3 tmpvar_316;
          tmpvar_316 = ((tmpvar_282.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_282.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_314 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_316)));
          T_315 = (tmpvar_281 - vec3(-14.0, 14.0, -14.0));
          u_313 = (dot (T_315, tmpvar_316) * invDet_314);
          if (((u_313 < 0.0) || (u_313 > 1.0))) {
            tmpvar_310 = bool(0);
          } else {
            lowp vec3 tmpvar_317;
            tmpvar_317 = ((T_315.yzx * vec3(2.0, 28.0, -19.0)) - (T_315.zxy * vec3(-19.0, 2.0, 28.0)));
            v_312 = (dot (tmpvar_282, tmpvar_317) * invDet_314);
            if (((v_312 < 0.0) || ((u_313 + v_312) > 1.0))) {
              tmpvar_310 = bool(0);
            } else {
              t1_311 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_317) * invDet_314);
              if ((t1_311 > 0.001)) {
                tmpvar_309 = t1_311;
                tmpvar_310 = bool(1);
              } else {
                tmpvar_310 = bool(0);
              };
            };
          };
          if ((tmpvar_310 && ((tmpvar_309 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_309;
            tmpvar_283 = 11;
          };
          bool tmpvar_318;
          tmpvar_318 = bool(1);
          bool tmpvar_319;
          lowp float tmpvar_320;
          bool tmpvar_321;
          lowp float tmpvar_322;
          tmpvar_322 = ((vec3(0.0, -10.0, 0.0) - tmpvar_281).y / tmpvar_282.y);
          if ((tmpvar_322 < 0.001)) {
            tmpvar_321 = bool(0);
          } else {
            tmpvar_320 = tmpvar_322;
            tmpvar_321 = bool(1);
          };
          if (tmpvar_321) {
            lowp float tmpvar_323;
            lowp vec3 tmpvar_324;
            tmpvar_324 = ((tmpvar_281 + (tmpvar_320 * tmpvar_282)) - vec3(0.0, -10.0, 0.0));
            tmpvar_323 = sqrt(dot (tmpvar_324, tmpvar_324));
            if ((tmpvar_323 <= 30.0)) {
              tmpvar_319 = bool(1);
              tmpvar_318 = bool(0);
            };
          };
          if (tmpvar_318) {
            tmpvar_319 = bool(0);
            tmpvar_318 = bool(0);
          };
          if ((tmpvar_319 && ((tmpvar_320 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_320;
            tmpvar_283 = 12;
          };
          lowp float tmpvar_325;
          bool tmpvar_326;
          lowp float tmpvar_327;
          tmpvar_327 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_281)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_282));
          if ((tmpvar_327 < 0.001)) {
            tmpvar_326 = bool(0);
          } else {
            tmpvar_325 = tmpvar_327;
            tmpvar_326 = bool(1);
          };
          if ((tmpvar_326 && ((tmpvar_325 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_325;
            tmpvar_283 = 14;
          };
          lowp float tmpvar_328;
          bool tmpvar_329;
          lowp float tmpvar_330;
          tmpvar_330 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_281).y / tmpvar_282.y);
          if ((tmpvar_330 < 0.001)) {
            tmpvar_329 = bool(0);
          } else {
            tmpvar_328 = tmpvar_330;
            tmpvar_329 = bool(1);
          };
          if ((tmpvar_329 && ((tmpvar_328 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_328;
            tmpvar_283 = 15;
          };
          lowp float tmpvar_331;
          bool tmpvar_332;
          lowp float tmpvar_333;
          tmpvar_333 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_281).z / tmpvar_282.z);
          if ((tmpvar_333 < 0.001)) {
            tmpvar_332 = bool(0);
          } else {
            tmpvar_331 = tmpvar_333;
            tmpvar_332 = bool(1);
          };
          if ((tmpvar_332 && ((tmpvar_331 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_331;
            tmpvar_283 = 16;
          };
          lowp float tmpvar_334;
          bool tmpvar_335;
          lowp float tmpvar_336;
          tmpvar_336 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_281).x / tmpvar_282.x);
          if ((tmpvar_336 < 0.001)) {
            tmpvar_335 = bool(0);
          } else {
            tmpvar_334 = tmpvar_336;
            tmpvar_335 = bool(1);
          };
          if ((tmpvar_335 && ((tmpvar_334 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_334;
            tmpvar_283 = 17;
          };
          lowp float tmpvar_337;
          bool tmpvar_338;
          lowp float tmpvar_339;
          tmpvar_339 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_281)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_282));
          if ((tmpvar_339 < 0.001)) {
            tmpvar_338 = bool(0);
          } else {
            tmpvar_337 = tmpvar_339;
            tmpvar_338 = bool(1);
          };
          if ((tmpvar_338 && ((tmpvar_337 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_337;
            tmpvar_283 = 18;
          };
          lowp float tmpvar_340;
          bool tmpvar_341;
          lowp float tmpvar_342;
          tmpvar_342 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_281)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_282));
          if ((tmpvar_342 < 0.001)) {
            tmpvar_341 = bool(0);
          } else {
            tmpvar_340 = tmpvar_342;
            tmpvar_341 = bool(1);
          };
          if ((tmpvar_341 && ((tmpvar_340 < minT_285) || (minT_285 < 0.0)))) {
            minT_285 = tmpvar_340;
            tmpvar_283 = 19;
          };
          if ((((
            (((tmpvar_283 != 0) && (tmpvar_283 != 5)) && (tmpvar_283 != 6))
           && 
            (tmpvar_283 != 12)
          ) && (tmpvar_283 != tmpvar_18)) && (tmpvar_18 <= 12))) {
            specular_132 = vec3(0.0, 0.0, 0.0);
            diffuse_133 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_134 = (color_134 + (diffuse_133 + specular_132));
        tmpvar_129 = color_134;
      };
      color_15 = (color_15 + (tmpvar_129 * coeff_4));
      if ((tmpvar_18 == 0)) {
        float tmpvar_343;
        tmpvar_343 = (time / 5.0);
        u_9 = (u_9 + tmpvar_343);
        v_8 = (v_8 + tmpvar_343);
        lowp vec2 tmpvar_344;
        tmpvar_344.x = u_9;
        tmpvar_344.y = v_8;
        color_15 = (color_15 * (texture (sunTexture, tmpvar_344).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_18 == 3)) {
          if (!(useNormalMap)) {
            u_9 = (u_9 + (time / 2.0));
          };
          lowp vec2 tmpvar_345;
          tmpvar_345.x = u_9;
          tmpvar_345.y = v_8;
          color_15 = (color_15 * texture (earthTexture, tmpvar_345).xyz);
        } else {
          if ((tmpvar_18 == 4)) {
            if (!(useNormalMap)) {
              u_9 = (u_9 + (time / 7.0));
            };
            lowp vec2 tmpvar_346;
            tmpvar_346.x = u_9;
            tmpvar_346.y = v_8;
            color_15 = (color_15 * texture (moonTexture, tmpvar_346).xyz);
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
      bool tmpvar_347;
      tmpvar_347 = (((tmpvar_18 == 3) && (color_15.z > color_15.x)) && (color_15.z > color_15.y));
      if ((((tmpvar_125 || tmpvar_124) || tmpvar_347) && (bounceCount_5 <= depth))) {
        bool totalInternalReflection_348;
        totalInternalReflection_348 = bool(0);
        if (tmpvar_124) {
          Ray refractedRay_349;
          float tmpvar_350;
          tmpvar_350 = (1.0/(tmpvar_127));
          lowp float tmpvar_351;
          tmpvar_351 = dot (ray_1.dir, tmpvar_13);
          lowp vec3 tmpvar_352;
          if ((tmpvar_351 <= 0.0)) {
            vec3 I_353;
            I_353 = ray_1.dir;
            lowp vec3 tmpvar_354;
            lowp float tmpvar_355;
            tmpvar_355 = dot (tmpvar_13, I_353);
            lowp float tmpvar_356;
            tmpvar_356 = (1.0 - (tmpvar_350 * (tmpvar_350 * 
              (1.0 - (tmpvar_355 * tmpvar_355))
            )));
            if ((tmpvar_356 < 0.0)) {
              tmpvar_354 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_354 = ((tmpvar_350 * I_353) - ((
                (tmpvar_350 * tmpvar_355)
               + 
                sqrt(tmpvar_356)
              ) * tmpvar_13));
            };
            tmpvar_352 = tmpvar_354;
          } else {
            vec3 I_357;
            I_357 = ray_1.dir;
            lowp vec3 N_358;
            N_358 = -(tmpvar_13);
            float eta_359;
            eta_359 = (1.0/(tmpvar_350));
            lowp vec3 tmpvar_360;
            lowp float tmpvar_361;
            tmpvar_361 = dot (N_358, I_357);
            lowp float tmpvar_362;
            tmpvar_362 = (1.0 - (eta_359 * (eta_359 * 
              (1.0 - (tmpvar_361 * tmpvar_361))
            )));
            if ((tmpvar_362 < 0.0)) {
              tmpvar_360 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_360 = ((eta_359 * I_357) - ((
                (eta_359 * tmpvar_361)
               + 
                sqrt(tmpvar_362)
              ) * N_358));
            };
            tmpvar_352 = tmpvar_360;
          };
          refractedRay_349.dir = tmpvar_352;
          vec3 x_363;
          x_363 = refractedRay_349.dir;
          totalInternalReflection_348 = (sqrt(dot (x_363, x_363)) < 0.001);
          if (totalInternalReflection_348) {
            vec3 I_364;
            I_364 = ray_1.dir;
            lowp vec3 N_365;
            N_365 = -(tmpvar_13);
            ray_1.dir = normalize((I_364 - (2.0 * 
              (dot (N_365, I_364) * N_365)
            )));
            ray_1.origin = (tmpvar_20 - (tmpvar_13 * 0.001));
          } else {
            refractedRay_349.origin = (tmpvar_20 + ((tmpvar_13 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_13)
            )));
            refractedRay_349.dir = normalize(refractedRay_349.dir);
            if (!(tmpvar_125)) {
              ray_1 = refractedRay_349;
            } else {
              stack_7[stackSize_6].coeff = (coeff_4 * (vec3(1.0, 1.0, 1.0) - (tmpvar_126 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_126) * pow ((1.0 - abs(
                  dot (tmpvar_13, ray_1.dir)
                )), 5.0))
              )));
              stack_7[stackSize_6].depth = bounceCount_5;
              highp int tmpvar_366;
              tmpvar_366 = stackSize_6;
              stackSize_6++;
              stack_7[tmpvar_366].ray = refractedRay_349;
            };
          };
        };
        if ((((tmpvar_125 && 
          !(totalInternalReflection_348)
        ) && (tmpvar_18 != 3)) || tmpvar_347)) {
          lowp float tmpvar_367;
          tmpvar_367 = dot (ray_1.dir, tmpvar_13);
          if ((tmpvar_367 < 0.0)) {
            coeff_4 = (coeff_4 * (tmpvar_126 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_126)
             * 
              pow ((1.0 - abs(dot (tmpvar_13, ray_1.dir))), 5.0)
            )));
            vec3 I_368;
            I_368 = ray_1.dir;
            ray_1.dir = normalize((I_368 - (2.0 * 
              (dot (tmpvar_13, I_368) * tmpvar_13)
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
      vec3 glowness_369;
      vec3 tmpvar_370;
      tmpvar_370 = normalize(ray_1.dir);
      vec3 tmpvar_371;
      tmpvar_371 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_370)
      ) * tmpvar_370));
      float tmpvar_372;
      tmpvar_372 = sqrt(dot (tmpvar_371, tmpvar_371));
      lowp float tmpvar_373;
      lowp vec3 x_374;
      x_374 = (tmpvar_20 - eye);
      tmpvar_373 = sqrt(dot (x_374, x_374));
      float tmpvar_375;
      vec3 x_376;
      x_376 = (spheres[0].xyz - eye);
      tmpvar_375 = sqrt(dot (x_376, x_376));
      if (((tmpvar_373 + spheres[0].w) < tmpvar_375)) {
        glowness_369 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_369 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_372 * tmpvar_372))
        ), 0.0, 1.0));
      };
      color_15 = (color_15 + glowness_369);
    };
    if ((!(continueLoop_3) && (stackSize_6 > 0))) {
      highp int tmpvar_377;
      tmpvar_377 = (stackSize_6 - 1);
      stackSize_6 = tmpvar_377;
      ray_1 = stack_7[tmpvar_377].ray;
      bounceCount_5 = stack_7[tmpvar_377].depth;
      coeff_4 = stack_7[tmpvar_377].coeff;
      continueLoop_3 = bool(1);
    };
    i_2++;
  };
  lowp vec4 tmpvar_378;
  tmpvar_378.w = 1.0;
  tmpvar_378.x = color_15[colorModeInTernary[0]];
  tmpvar_378.y = color_15[colorModeInTernary[1]];
  tmpvar_378.z = color_15[colorModeInTernary[2]];
  fragColor = tmpvar_378;
}